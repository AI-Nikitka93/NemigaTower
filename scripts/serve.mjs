import { createServer } from 'node:http';
import { appendFileSync, createReadStream, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const rootDir = process.cwd();
const distDir = resolve(rootDir, 'dist');
const analyticsDir = resolve(rootDir, 'output', 'analytics');
const analyticsFile = join(analyticsDir, 'events.ndjson');
const port = Number(process.env.PORT || 41873);
const host = process.env.HOST || '127.0.0.1';

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp'
};

function cacheControlFor(filePath) {
  const extension = extname(filePath);

  if (['.html', '.css', '.js', '.json'].includes(extension)) {
    return 'no-cache';
  }

  if (['.svg', '.png', '.jpg', '.jpeg', '.webp'].includes(extension)) {
    return 'public, max-age=31536000, immutable';
  }

  return 'public, max-age=3600';
}

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const normalizedPath = normalize(cleanPath).replace(/^(\.\.[/\\])+/, '');
  const absolutePath = resolve(distDir, normalizedPath === '/' ? 'index.html' : `.${normalizedPath}`);

  if (!absolutePath.startsWith(distDir)) {
    return null;
  }

  if (existsSync(absolutePath) && statSync(absolutePath).isFile()) {
    return absolutePath;
  }

  return join(distDir, 'index.html');
}

function readRequestBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 64_000) {
        rejectBody(new Error('Analytics payload too large'));
        request.destroy();
      }
    });
    request.on('end', () => resolveBody(body));
    request.on('error', rejectBody);
  });
}

async function handleAnalyticsRequest(request, response) {
  if (request.method === 'GET') {
    const events = existsSync(analyticsFile)
      ? readFileSync(analyticsFile, 'utf8').trim().split('\n').filter(Boolean).slice(-100)
      : [];
    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    response.end(JSON.stringify({ events }));
    return;
  }

  if (request.method !== 'POST') {
    response.writeHead(405, { 'Allow': 'GET, POST' });
    response.end();
    return;
  }

  try {
    const body = await readRequestBody(request);
    const parsed = JSON.parse(body || '{}');
    mkdirSync(analyticsDir, { recursive: true });
    appendFileSync(analyticsFile, `${JSON.stringify({
      receivedAt: new Date().toISOString(),
      ...parsed
    })}\n`, 'utf8');
    response.writeHead(204, {
      'Cache-Control': 'no-cache'
    });
    response.end();
  } catch {
    response.writeHead(400, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    response.end(JSON.stringify({ error: 'Invalid analytics payload' }));
  }
}

const server = createServer(async (request, response) => {
  const requestPath = (request.url || '/').split('?')[0];
  if (requestPath === '/analytics') {
    await handleAnalyticsRequest(request, response);
    return;
  }

  const filePath = resolveRequestPath(request.url || '/');
  if (!filePath || !existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
    'Cache-Control': cacheControlFor(filePath)
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Serving dist at http://${host}:${port}/`);
});
