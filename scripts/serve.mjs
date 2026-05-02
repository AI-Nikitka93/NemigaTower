import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const rootDir = process.cwd();
const distDir = resolve(rootDir, 'dist');
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

  if (extension === '.html') {
    return 'no-cache';
  }

  if (['.css', '.js', '.json', '.svg', '.png', '.jpg', '.jpeg', '.webp'].includes(extension)) {
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

const server = createServer((request, response) => {
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
