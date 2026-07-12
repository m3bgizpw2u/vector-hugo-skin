// Local-only static file server for tools/shortcodes-generator/.
// Pure Node stdlib + TypeScript's transpileModule (already a dev-dep).
//
// On-the-fly TS handling:
//   - `.ts` and `.js` requests resolve to the matching .ts file on disk
//     (modules import each other as `./foo.js` even though the source
//     is `foo.ts` — a TS convention under `moduleResolution: bundler`).
//   - .ts source bytes are run through `ts.transpileModule` to strip
//     type annotations before being sent. Without this step the
//     browser's native ESM parser throws `SyntaxError: Unexpected
//     identifier 'as'` on the first generic/cast/interface it sees
//     and the entire app fails to boot. Plan line 310 called this out
//     as the implementation-phase open question; this is the answer.
//
// Repo-wide `npm run check:ts` enforces type safety statically; the
// runtime in dev is plain JS produced by the in-process transpiler.
//
// Usage:
//   node tools/shortcodes-generator/dev-server.mjs
// Prints: http://localhost:8731/
// Open the printed URL in a browser; Ctrl-C to stop.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const PORT = 8731;
const HERE = fileURLToPath(new URL('.', import.meta.url));
const ROOT = HERE; // server files from the tool's own folder

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.ts': 'application/javascript; charset=utf-8', // browser receives stripped JS
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

const TS_COMPILE_OPTIONS = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ES2022,
};

function safeJoin(root, urlPath) {
  // Decode URI, strip leading slash, prevent escape via ..
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const stripped = decoded.replace(/^\/+/, '');
  const joined = normalize(join(root, stripped));
  // Normalize root to no trailing separator for the startsWith check,
  // but accept either form.
  const rootNoSep = root.endsWith(sep) ? root.slice(0, -sep.length) : root;
  if (joined !== rootNoSep && joined !== root && !joined.startsWith(rootNoSep + sep)) {
    return null;
  }
  return joined;
}

async function resolveOnDisk(rootFile) {
  // If the request hits an existing file, use it. If the request is
  // `foo.js` but only `foo.ts` exists, fall back to the .ts so module
  // imports between TS files (which TS rewrites to ./foo.js) keep
  // working without source edits.
  try {
    const s = await stat(rootFile);
    if (s.isFile()) return rootFile;
    return null;
  } catch {
    if (extname(rootFile) === '.js') {
      const tsCandidate = rootFile.slice(0, -3) + '.ts';
      try {
        const s = await stat(tsCandidate);
        if (s.isFile()) return tsCandidate;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function maybeTranspile(filePath, buf) {
  if (extname(filePath) !== '.ts') return buf;
  const { outputText } = ts.transpileModule(buf.toString('utf8'), {
    compilerOptions: TS_COMPILE_OPTIONS,
    fileName: basename(filePath),
  });
  return Buffer.from(outputText, 'utf8');
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
    const resolved = await resolveOnDisk(target);
    if (!resolved) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 — ${req.url}\n`);
      return;
    }
    const raw = await readFile(resolved);
    const body = maybeTranspile(resolved, raw);
    const mime = MIME[extname(target).toLowerCase()] ?? 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`server error: ${String(err)}\n`);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\nShortcodes generator — http://localhost:${PORT}/\n`);
  console.log('Press Ctrl-C to stop the server.\n');
});
