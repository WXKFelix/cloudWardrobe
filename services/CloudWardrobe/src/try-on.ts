import { randomUUID } from 'node:crypto';
import { createServer, type IncomingMessage } from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';

const apiKey = process.env.DASHSCOPE_API_KEY?.trim();
const baseUrl = 'https://dashscope.aliyuncs.com/api/v1';
const model = 'aitryon';
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

  const { personImage, garmentImage } = body ?? {};
  return { person: decodeImage(personImage), garment: decodeImage(garmentImage) };
}

function decodeImage(value: unknown) {
  const match = typeof value === 'string' ? imagePattern.exec(value) : null;
  if (!match) throw new RequestError(400, '请选择 JPG、PNG 或 WebP 照片。');
  const [, contentType, encoded] = match;
  const bytes = Buffer.from(encoded, 'base64');
  return new Blob([new Uint8Array(bytes)], { type: contentType });
}

async function dashScope<T>(path: string, signal: AbortSignal, body?: object): Promise<T> {
  const response = await fetch(`${baseUrl}/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(body && {
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
        'X-DashScope-OssResourceResolve': 'enable',
      }),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  if (response.status === 401 || response.status === 403) {
    throw new RequestError(502, '百炼鉴权失败，请检查华北 2（北京）的 API Key 和模型权限。');
  }
  if (response.status === 429) throw new RequestError(429, '百炼调用频率过高，请稍后重试。');
  if (!response.ok) throw new RequestError(502, '百炼请求失败，请检查模型额度和照片格式。');
  return response.json();
}

interface UploadPolicy {
  upload_host: string;
  upload_dir: string;
  oss_access_key_id: string;
  signature: string;
  policy: string;
  x_oss_object_acl: string;
  x_oss_forbid_overwrite: string;
}

async function uploadPhoto(image: Blob, policy: UploadPolicy, signal: AbortSignal) {
  const filename = `${randomUUID()}.${image.type.split('/')[1]}`;
  const key = `${policy.upload_dir}/${filename}`;
  const form = new FormData();
  form.set('OSSAccessKeyId', policy.oss_access_key_id);
  form.set('Signature', policy.signature);
  form.set('policy', policy.policy);
  form.set('x-oss-object-acl', policy.x_oss_object_acl);
  form.set('x-oss-forbid-overwrite', policy.x_oss_forbid_overwrite);
  form.set('key', key);
  form.set('success_action_status', '200');
  form.set('file', image, filename);

  const host = new URL(policy.upload_host);
  if (!host.hostname.endsWith('.aliyuncs.com')) {
    throw new RequestError(502, '百炼返回了无效的上传地址。');
  }
  host.protocol = 'https:';
  const response = await fetch(host, { method: 'POST', body: form, signal, redirect: 'error' });
  if (!response.ok) throw new RequestError(502, '照片上传到百炼失败，请稍后重试。');
  return `oss://${key}`;
}

interface Prediction {
  output?: { task_id?: string; task_status?: string; image_url?: string };
}

async function generateTryOn(images: Awaited<ReturnType<typeof readImages>>, signal: AbortSignal) {
  const { data: policy } = await dashScope<{ data?: UploadPolicy }>(`uploads?action=getPolicy&model=${model}`, signal);
  if (!policy) throw new RequestError(502, '无法获取百炼照片上传凭证。');

  const [personUrl, garmentUrl] = await Promise.all([
    uploadPhoto(images.person, policy, signal),
    uploadPhoto(images.garment, policy, signal),
  ]);
  const job = await dashScope<Prediction>('services/aigc/image2image/image-synthesis', signal, {
    model,
    input: { person_image_url: personUrl, top_garment_url: garmentUrl },
    parameters: { restore_face: true },
  });
  const taskId = job.output?.task_id;
  if (!taskId) throw new RequestError(502, '无法开始百炼试穿，请稍后重试。');

  while (!signal.aborted) {
    await delay(3000, undefined, { signal });
    const { output } = await dashScope<Prediction>(`tasks/${encodeURIComponent(taskId)}`, signal);
    if (output?.task_status === 'SUCCEEDED' && /^https?:\/\//i.test(output.image_url ?? '')) {
      return output.image_url!.replace(/^http:/i, 'https:');
    }
    if (!['PENDING', 'RUNNING'].includes(output?.task_status ?? '')) {
      throw new RequestError(502, '无法生成上身图，请检查额度或换一张正面清晰的照片再试。');
    }
  }
  signal.throwIfAborted();
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
  try {
    const images = await readImages(request);
    const imageUri = await generateTryOn(images, controller.signal);
    send(200, { imageUri });
  } catch (error) {
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
