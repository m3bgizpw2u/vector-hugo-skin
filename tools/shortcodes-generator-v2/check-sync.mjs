#!/usr/bin/env node
// Sync lint for tools/shortcodes-generator-v2/.
// Verifies that every TS spec under src/data/ has a matching layout under
// layouts/_shortcodes/, and vice versa (excluding the documented out-of-scope set).
//
// Usage:
//   node tools/shortcodes-generator-v2/check-sync.mjs

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const REPO = join(HERE, '..', '..');
const TOOL_DATA = join(REPO, 'tools', 'shortcodes-generator-v2', 'src', 'data');
const SHORTCODES = join(REPO, 'layouts', '_shortcodes');

const OUT_OF_SCOPE = new Set([
  'break', 'cite-ref', 'references', 'figure', 'thumb',
]);

async function listSpecSlugs() {
  const slugs = new Set();
  const subdirs = await readdir(TOOL_DATA).catch(() => []);
  for (const sub of subdirs) {
    const subPath = join(TOOL_DATA, sub);
    const stat = await readdir(subPath).catch(() => null);
    if (!stat) continue;
    for (const file of stat) {
      if (!file.endsWith('.ts')) continue;
      const text = await readFile(join(subPath, file), 'utf8');
      // Extract `slug: '<value>'` from the file.
      const match = text.match(/^\s*slug:\s*['"]([^'"]+)['"]/m);
      if (match) slugs.add(match[1]);
    }
  }
  return [...slugs].sort();
}

async function listWrappers() {
  const entries = await readdir(SHORTCODES);
  const out = new Set();
  for (const entry of entries) {
    if (entry.endsWith('.html')) {
      out.add(entry.slice(0, -'.html'.length));
      continue;
    }
    const folderVariant = join(SHORTCODES, entry, `${entry}.html`);
    if (existsSync(folderVariant)) out.add(entry);
  }
  return out;
}

function wrapperExists(slug) {
  if (existsSync(join(SHORTCODES, `${slug}.html`))) return true;
  if (existsSync(join(SHORTCODES, slug, `${slug}.html`))) return true;
  return false;
}

async function main() {
  const slugs = await listSpecSlugs();
  const wrappers = await listWrappers();

  const errors = [];

  for (const slug of slugs) {
    if (!wrapperExists(slug)) {
      errors.push(
        `src/data/*/${slug}.ts has no matching layouts/_shortcodes/${slug}.html (or ${slug}/${slug}.html)`,
      );
    }
  }

  for (const wrapper of wrappers) {
    if (OUT_OF_SCOPE.has(wrapper)) continue;
    if (!slugs.includes(wrapper)) {
      errors.push(
        `layouts/_shortcodes/${wrapper}.html has no matching src/data spec`,
      );
    }
  }

  if (errors.length === 0) {
    console.log(`OK — ${slugs.length} specs in sync (${wrappers.size} wrappers, ${slugs.length} specs).`);
    process.exit(0);
  }

  console.error(`Found ${errors.length} sync issue(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

main().catch((err) => {
  console.error('check-sync failed:', err);
  process.exit(1);
});
