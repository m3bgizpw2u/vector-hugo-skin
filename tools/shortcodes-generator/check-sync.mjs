// Sync lint: asserts every data/<slug>.yaml in the tool has a matching
// layouts/_shortcodes/<slug>.html (or folder variant), and vice versa,
// within the infobox family.
//
// Out of scope for this lint: shortcodes that don't have a per-field
// YAML form — namely `break` (a float-clear primitive), `figure` and
// `thumb` (article-body media, see docs/SHORTCODES.md §A), and
// `cite-ref` / `references` (citation markers). Those are documented
// elsewhere and intentionally have no generator UI.
//
// Usage: npm run tools:check
//        node tools/shortcodes-generator/check-sync.mjs

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const REPO = join(HERE, '..', '..');
const TOOL_DATA = join(REPO, 'tools', 'shortcodes-generator', 'data');
const SHORTCODES = join(REPO, 'layouts', '_shortcodes');

const errors = [];

async function listToolYamls() {
  const entries = await readdir(TOOL_DATA);
  return entries
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => f.slice(0, -'.yaml'.length))
    .sort();
}

async function listWrappers() {
  const entries = await readdir(SHORTCODES);
  const out = new Set();
  for (const entry of entries) {
    if (entry.endsWith('.html')) {
      out.add(entry.slice(0, -'.html'.length));
      continue;
    }
    // Folder variant: <slug>/<slug>.html
    const candidate = join(SHORTCODES, entry, `${entry}.html`);
    if (existsSync(candidate)) out.add(entry);
  }
  return out;
}

// Shortcodes the tool intentionally does not cover. These are
// documented elsewhere (see docs/SHORTCODES.md §A for figure + thumb,
// the note for `cite-ref` / `references` in §10, and `break` in the
// component catalogue). They are skipped from sync checks so adding
// or removing one does not affect `npm run tools:check`.
const OUT_OF_SCOPE = new Set([
  'break',
  'cite-ref',
  'references',
  'figure',
  'thumb',
]);

function wrapperExists(slug) {
  if (existsSync(join(SHORTCODES, `${slug}.html`))) return true;
  if (existsSync(join(SHORTCODES, slug, `${slug}.html`))) return true;
  // Inner primitives live under _shortcodes/infobox/<slug>.html
  if (existsSync(join(SHORTCODES, 'infobox', `${slug}.html`))) return true;
  return false;
}

async function validateYamlSlug(slug) {
  const text = await readFile(join(TOOL_DATA, `${slug}.yaml`), 'utf8');
  const match = text.match(/^slug:\s*([^\s#]+)/m);
  if (!match) {
    errors.push(`${slug}.yaml: missing 'slug:' declaration`);
    return;
  }
  const declared = match[1].replace(/^["']|["']$/g, '');
  if (declared !== slug) {
    errors.push(`${slug}.yaml: slug is '${declared}' but filename is '${slug}.yaml'`);
  }
}

async function main() {
  const yamls = await listToolYamls();
  const wrappers = await listWrappers();

  // YAMLs without a wrapper
  for (const slug of yamls) {
    if (!wrapperExists(slug)) {
      errors.push(
        `data/${slug}.yaml has no matching layouts/_shortcodes/${slug}.html (or ${slug}/${slug}.html, or infobox/${slug}.html)`
      );
    }
  }

  // Wrappers without a YAML
  for (const slug of wrappers) {
    if (OUT_OF_SCOPE.has(slug)) continue;
    if (!yamls.includes(slug)) {
      errors.push(
        `layouts/_shortcodes/${slug}.html has no matching tools/shortcodes-generator/data/${slug}.yaml`
      );
    }
  }

  // Each YAML's slug matches its filename
  for (const slug of yamls) {
    await validateYamlSlug(slug);
  }

  if (errors.length === 0) {
    console.log(`OK — ${yamls.length} shortcodes in sync (${wrappers.size} wrappers, ${yamls.length} YAMLs).`);
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
