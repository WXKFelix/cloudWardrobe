import { createServer, type IncomingMessage } from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';

const apiKey = process.env.FASHN_API_KEY;
const port = Number(process.env.TRY_ON_PORT ?? 8787);
const host = process.env.TRY_ON_HOST ?? '127.0.0.1';
const webOrigin = process.env.TRY_ON_WEB_ORIGIN ?? 'http://localhost:19006';
const maxBodyBytes = 24 * 1024 * 1024;
const imagePattern = /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
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
  if ([personImage, garmentImage].some((image) => typeof image !== 'string' || !imagePattern.test(image))) {
    throw new RequestError(400, '请选择 JPG、PNG 或 WebP 照片。');
  }
  return { personImage, garmentImage };
}

interface Prediction {
  id?: string;
  status?: string;
  output?: string[];
  error?: unknown;
}

async function fashn(path: string, signal: AbortSignal, body?: object): Promise<Prediction> {
  const response = await fetch(`https://api.fashn.ai/v1/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  if (!response.ok) throw new RequestError(502, '试穿服务暂时无法生成图片，请稍后重试。');
  return response.json();
}

async function generateTryOn(images: Awaited<ReturnType<typeof readImages>>, signal: AbortSignal) {
  const job = await fashn('run', signal, {
    model_name: 'tryon-v1.6',
    inputs: {
      model_image: images.personImage,
      garment_image: images.garmentImage,
      category: 'tops',
      moderation_level: 'conservative',
      return_base64: true,
    },
  });
  if (!job.id || job.error) throw new RequestError(502, '无法开始试穿，请稍后重试。');

  while (!signal.aborted) {
    await delay(1500, undefined, { signal });
    const result = await fashn(`status/${encodeURIComponent(job.id)}`, signal);
    if (result.status === 'completed' && imagePattern.test(result.output?.[0] ?? '')) {
      return result.output![0];
    }
    if (result.error || ['completed', 'failed', 'canceled', 'cancelled'].includes(result.status ?? '')) {
      throw new RequestError(502, '无法生成上身图，请换一张正面清晰的照片再试。');
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
  if (!apiKey) return send(503, { error: '试穿服务尚未配置 FASHN 密钥。' });
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
    generating = false;
  }
}).listen(port, host, () => console.log(`Try-on API listening on http://${host}:${port}`));
