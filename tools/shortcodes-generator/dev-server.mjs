// Local-only static file server for tools/shortcodes-generator/.
// Pure Node stdlib (http + fs + path) — no runtime deps.
// TS source files are served as application/javascript; the browser ignores
// type annotations natively for the subset this tool uses. Repo-wide
// `npm run check:ts` enforces type safety statically.
//
// Usage:
//   node tools/shortcodes-generator/dev-server.mjs
// Prints: http://localhost:8731/
// Open the printed URL in a browser; Ctrl-C to stop.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 8731;
const HERE = fileURLToPath(new URL('.', import.meta.url));
const ROOT = HERE; // server files from the tool's own folder

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.ts': 'application/javascript; charset=utf-8', // browser strips type annotations
  '.yaml': 'application/yaml; charset=utf-8',
  '.yml': 'application/yaml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function safeJoin(root, urlPath) {
  // Decode URI, strip leading slash, prevent escape via ..
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const stripped = decoded.replace(/^\/+/, '');
  const joined = normalize(join(root, stripped));
  if (joined !== root && !joined.startsWith(root + sep)) return null;
  return joined;
}

const server = createServer(async (req, res) => {
  let path = safeJoin(ROOT, req.url ?? '/');
  if (!path) {
    res.writeHead(400);
    res.end('bad path');
    return;
  }
  try {
    let target = path;
    const s = await stat(target).catch(() => null);
    if (s && s.isDirectory()) target = join(target, 'index.html');
    const buf = await readFile(target);
    const mime = MIME[extname(target).toLowerCase()] ?? 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'no-store',
    });
    res.end(buf);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 — ${req.url}\n`);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\nShortcodes generator — http://localhost:${PORT}/\n`);
  console.log('Press Ctrl-C to stop the server.\n');
});