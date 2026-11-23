import { createServer, type IncomingMessage } from 'node:http';

const apiKey = process.env.DASHSCOPE_API_KEY?.trim();
const defaultBaseUrl = 'https://dashscope.aliyuncs.com/api/v1';
const modelBaseUrl = process.env.DASHSCOPE_BASE_URL?.trim().replace(/\/+$/, '') || defaultBaseUrl;
if (!/^https:\/\/(?:dashscope\.aliyuncs\.com|[a-z0-9-]+\.cn-beijing\.maas\.aliyuncs\.com)\/api\/v1$/i.test(modelBaseUrl)) {
  throw new Error('DASHSCOPE_BASE_URL 必须是华北 2（北京）的 DashScope 原生 API 地址，以 /api/v1 结尾。');
}
const model = 'qwen-image-2.0-pro';
const port = Number(process.env.TRY_ON_PORT ?? 8787);
const host = process.env.TRY_ON_HOST ?? '127.0.0.1';
const webOrigin = process.env.TRY_ON_WEB_ORIGIN ?? 'http://localhost:19006';
const maxBodyBytes = 24 * 1024 * 1024;
const imagePattern = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/;
let generating = false;

class RequestError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

async function readImages(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    size += chunk.length;
    if (size > maxBodyBytes) throw new RequestError(413, '照片太大，请选择较小的照片。');
    chunks.push(chunk);
  }

  let body;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new RequestError(400, '请求格式有误。');
  }

  const { personImage, garmentImage, garments } = body ?? {};
  const references: unknown = garments ?? [{ category: 'top', image: garmentImage }];
  if (!Array.isArray(references) || references.length < 1 || references.length > 3) {
    throw new RequestError(400, '请选择 1 至 3 件衣物。');
  }
  const categories = new Set<string>();
  const items = references.map((item) => {
    const category: unknown = item?.category;
    if (typeof category !== 'string' || !Object.hasOwn(garmentLabels, category) || categories.has(category)) {
      throw new RequestError(400, '搭配中的衣物类型无效或重复。');
    }
    categories.add(category);
    return { category: category as keyof typeof garmentLabels, image: validateImage(item.image) };
  });
  return { person: validateImage(personImage), items };
}

const garmentLabels = { top: '上衣', outerwear: '外套', bottom: '裤子', shoes: '鞋子' } as const;

function validateImage(value: unknown): string {
  if (typeof value !== 'string' || !imagePattern.test(value)) {
    throw new RequestError(400, '请选择 JPG、PNG 或 WebP 照片。');
  }
  return value;
}

interface FailureTrace {
  stage: string;
  upstreamStatus?: number;
  code?: string;
  requestId?: string;
}

function logField(value: unknown) {
  return typeof value === 'string' && /^[a-z0-9_.:-]{1,128}$/i.test(value) ? value : undefined;
}

function enterStage(trace: FailureTrace, stage: string) {
  trace.stage = stage;
  trace.upstreamStatus = undefined;
  trace.code = undefined;
  trace.requestId = undefined;
}

interface DashScopeResponse {
  code?: string;
  request_id?: string;
}

interface ImageEditResponse extends DashScopeResponse {
  output?: { choices?: Array<{ message?: { content?: Array<{ image?: string }> } }> };
}

async function generateTryOn(images: Awaited<ReturnType<typeof readImages>>, signal: AbortSignal, trace: FailureTrace) {
  const base = await editImage(images.person, images.items.slice(0, 2), signal, trace);
  return images.items.length > 2
    ? editImage(base, images.items.slice(2), signal, trace)
    : base;
}

async function editImage(
  person: string,
  garments: Awaited<ReturnType<typeof readImages>>['items'],
  signal: AbortSignal,
  trace: FailureTrace,
) {
  const references = garments.map((item, index) => `第 ${index + 1} 张图是参考${garmentLabels[item.category]}`).join('，');
  enterStage(trace, `edit-${garments.map((item) => item.category).join('-')}`);
  const response = await fetch(`${modelBaseUrl}/services/aigc/multimodal-generation/generation`, {
    method: 'POST',
    redirect: 'error',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      input: {
        messages: [{
          role: 'user',
          content: [
            ...garments.map((item) => ({ image: item.image })),
            { image: person },
            { text: `${references}。以最后一张人物照片为底图，把人物身上对应部位全部换成各参考图里的衣物。保留人物的脸、体型、姿势、背景、画面比例和其他衣物。尽量还原参考图的款式、颜色和细节。输出一张自然的试穿照片。` },
          ],
        }],
      },
      parameters: { n: 1, prompt_extend: false },
    }),
    signal,
  });
  trace.upstreamStatus = response.status;
  trace.requestId = logField(response.headers.get('x-request-id'));
  const result = await response.json().catch(() => null) as ImageEditResponse | null;
  trace.code = logField(result?.code);
  trace.requestId = logField(result?.request_id) ?? trace.requestId;
  if (response.status === 401 || response.status === 403) {
    throw new RequestError(502, '百炼鉴权失败，请检查华北 2（北京）的 API Key 和模型权限。');
  }
  if (response.status === 429) throw new RequestError(429, '百炼调用频率过高，请稍后重试。');
  if (response.status === 404 && modelBaseUrl === defaultBaseUrl) {
    throw new RequestError(502, '百炼图像编辑返回 404，请确认模型可用，并在服务端设置业务空间的 DASHSCOPE_BASE_URL。');
  }
  if (!response.ok || !result || result.code) {
    throw new RequestError(502, '百炼请求失败，请检查模型额度和照片格式。');
  }
  const image = result.output?.choices?.[0]?.message?.content?.find(
    (part) => typeof part.image === 'string' && /^https:\/\//i.test(part.image)
  )?.image;
  if (!image) throw new RequestError(502, '百炼未返回上身预览图片。');
  return image;
}

createServer({ requestTimeout: 30_000 }, async (request, response) => {
  const send = (status: number, body: object) => {
    response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify(body));
  };
  if (request.url !== '/try-on') return send(404, { error: '接口不存在。' });

  const origin = request.headers.origin;
  if (origin && origin !== webOrigin) return send(403, { error: '当前页面来源未配置。' });
  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }).end();
    return;
  }

  if (request.method !== 'POST') return send(405, { error: '请求方式有误。' });
  if (request.headers['content-type']?.split(';')[0] !== 'application/json') {
    return send(415, { error: '请求格式有误。' });
  }
  if (!apiKey) return send(503, { error: '试穿服务尚未配置 阿里云百炼密钥（DASHSCOPE_API_KEY）。' });
  if (generating) return send(429, { error: '正在生成另一张上身图，请稍后重试。' });

  generating = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);
  response.on('close', () => controller.abort());
  const trace: FailureTrace = { stage: 'read-input' };
  try {
    const images = await readImages(request);
    const imageUri = await generateTryOn(images, controller.signal, trace);
    send(200, { imageUri });
  } catch (error) {
    console.error('[try-on] 失败', JSON.stringify({
      stage: trace.stage,
      upstreamStatus: trace.upstreamStatus ?? null,
      code: trace.code ?? null,
      requestId: trace.requestId ?? null,
    }));
    if (response.destroyed) return;
    if (error instanceof RequestError) send(error.status, { error: error.message });
    else if (controller.signal.aborted) send(504, { error: '生成超时，请稍后重试。' });
    else send(502, { error: '无法连接试穿服务，请稍后重试。' });
  } finally {
    clearTimeout(timeout);
    controller.abort();
    generating = false;
  }
}).listen(port, host, () => console.log(`Try-on API listening on http://${host}:${port}`));
