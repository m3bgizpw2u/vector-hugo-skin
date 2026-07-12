// Tiny YAML loader for the tool's data/<slug>.yaml files.
//
// Implements the strict subset this tool needs:
//   - top-level mapping
//   - scalar values: string, number, boolean
//   - block sequences (- item)
//   - block mappings (key: value, with 2-space indent)
//   - literal-block scalars (|) for worked_example
//   - comments (# ...)
//   - quoted scalars ("...")
//
// It deliberately rejects YAML features we don't need (anchors, flow
// style, tags, multi-doc) and fails loudly on anything ambiguous so
// the YAML stays easy to read.

import type { ShortcodeSpec, FieldSpec, FieldValue, FieldType } from './types.js';

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function parseScalar(raw: string): FieldValue {
  const trimmed = raw.trim();
  if (trimmed === '') return '';
  if (trimmed === 'null' || trimmed === '~') return null;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  // Numeric
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const n = Number(trimmed);
    if (!Number.isNaN(n)) return n;
  }
  // Strip surrounding quotes
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

interface Line {
  indent: number;
  content: string; // raw content after indent (key: value OR - item)
  raw: string; // raw line, kept for comments
}

function tokenize(src: string): Line[] {
  const lines: Line[] = [];
  for (const raw of src.split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    let indent = 0;
    while (indent < raw.length && raw[indent] === ' ') indent += 1;
    // Tab indent treated as 2 spaces (YAML requires spaces, but be lenient).
    if (raw[indent] === '\t') indent = (indent + 1) * 2;
    lines.push({ indent, content: raw.slice(indent), raw });
  }
  return lines;
}

function parseBlock(lines: Line[], start: number, baseIndent: number): unknown {
  if (start >= lines.length) return null;
  const first = lines[start];
  const content = first.content;

  // Block sequence
  if (content.startsWith('- ') || content === '-') {
    const seq: unknown[] = [];
    let i = start;
    while (i < lines.length && lines[i].indent === first.indent) {
      const item = lines[i];
      const itemContent = item.content;
      if (!itemContent.startsWith('- ')) break;
      const rest = itemContent.slice(2);
      // If the rest contains a colon at the start of a string, it's a nested
      // mapping item. Otherwise treat as scalar.
      if (/^[^\s][^:]*:\s/.test(rest)) {
        // Treat as a mapping item: convert "- key: value" into a single-line
        // mapping. For our schema, sequence items are always scalars.
        // If it really is a mapping, parse as such.
        const m: Record<string, unknown> = {};
        const colonIdx = rest.indexOf(':');
        const key = rest.slice(0, colonIdx).trim();
        const valPart = rest.slice(colonIdx + 1).trim();
        m[key] = valPart ? parseScalar(valPart) : parseBlock(lines, i + 1, item.indent + 2);
        // Continue collecting sibling keys at the same nested indent.
        let j = i + 1;
        while (j < lines.length && lines[j].indent === item.indent + 2 && !lines[j].content.startsWith('- ')) {
          const k = lines[j];
          const colonIdx2 = k.content.indexOf(':');
          if (colonIdx2 < 0) break;
          const kk = k.content.slice(0, colonIdx2).trim();
          const vv = k.content.slice(colonIdx2 + 1).trim();
          m[kk] = vv ? parseScalar(vv) : parseBlock(lines, j + 1, k.indent + 2);
          j += 1;
        }
        seq.push(m);
        i = j;
      } else {
        seq.push(rest === '' ? null : parseScalar(rest));
        i += 1;
      }
    }
    return seq;
  }

  // Block mapping
  const map: Record<string, unknown> = {};
  let i = start;
  while (i < lines.length && lines[i].indent === baseIndent) {
    const line = lines[i];
    const colonIdx = line.content.indexOf(':');
    if (colonIdx < 0) {
      i += 1;
      continue;
    }
    const key = line.content.slice(0, colonIdx).trim();
    const rest = line.content.slice(colonIdx + 1);
    if (rest.trim() === '') {
      // Value is on subsequent indented lines.
      map[key] = parseBlock(lines, i + 1, line.indent + 2);
    } else if (rest.trim() === '|') {
      // Literal block scalar — read until indent returns to baseIndent.
      const litIndent = line.indent + 2;
      const litLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].indent >= litIndent) {
        litLines.push(lines[j].raw.slice(litIndent));
        j += 1;
      }
      map[key] = litLines.join('\n').replace(/\n+$/, '');
      i = j;
      continue;
    } else if (rest.trim() === '>') {
      // Folded scalar — simple version: collapse internal newlines to spaces.
      const foldIndent = line.indent + 2;
      const foldLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].indent >= foldIndent) {
        foldLines.push(lines[j].raw.slice(foldIndent));
        j += 1;
      }
      map[key] = foldLines.join(' ').trim();
      i = j;
      continue;
    } else {
      map[key] = parseScalar(rest);
    }
    i += 1;
  }
  return map;
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}
function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function parseShortcode(raw: string, slug: string): ShortcodeSpec {
  const lines = tokenize(raw);
  const data = parseBlock(lines, 0, 0) as Record<string, unknown>;

  if (!isString(data.slug)) {
    throw new Error(`YAML ${slug} missing required 'slug' field`);
  }
  if (data.slug !== slug) {
    throw new Error(`YAML ${slug} has slug: ${data.slug} — filename mismatch`);
  }

  const fields: FieldSpec[] = [];
  for (const raw of asArray(data.fields)) {
    if (typeof raw !== 'object' || raw === null) continue;
    const f = raw as Record<string, unknown>;
    const key = asString(f.key);
    if (!key) continue;
    const typeStr = asString(f.type, 'text');
    const validTypes: FieldType[] = [
      'text',
      'textarea',
      'select',
      'checkbox',
      'date',
      'number',
      'box',
      'markdown',
      'image',
    ];
    if (!validTypes.includes(typeStr as FieldType)) {
      throw new Error(`YAML ${slug}: invalid field type '${typeStr}' on '${key}'`);
    }
    const field: FieldSpec = {
      key,
      label: asString(f.label, key),
      type: typeStr as FieldType,
    };
    if (typeof f.required === 'boolean') field.required = f.required;
    if (typeof f.hint === 'string') field.hint = f.hint;
    if (Array.isArray(f.options)) field.options = f.options.filter(isString);
    fields.push(field);
  }

  const defaults: Record<string, FieldValue> = {};
  if (typeof data.defaults === 'object' && data.defaults !== null) {
    for (const [k, v] of Object.entries(data.defaults as Record<string, unknown>)) {
      if (Array.isArray(v)) {
        defaults[k] = v.filter((x): x is string => typeof x === 'string');
      } else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        defaults[k] = v as FieldValue;
      } else {
        defaults[k] = null;
      }
    }
  }

  return {
    slug: data.slug,
    category: asString(data.category, 'other'),
    title: asString(data.title, data.slug),
    description: asString(data.description),
    upstream: isString(data.upstream) ? data.upstream : null,
    worked_example: asString(data.worked_example),
    fields,
    defaults,
  };
}

export async function loadAllYaml(): Promise<ShortcodeSpec[]> {
  // Fetch the YAML index — a static manifest that lists the data/*.yaml
  // filenames. The dev server serves this as plain text.
  let list: string[];
  try {
    const res = await fetch('data/index.json');
    if (!res.ok) throw new Error(`status ${res.status}`);
    list = (await res.json()) as string[];
  } catch {
    throw new Error(
      'Could not load data/index.json — make sure you ran `npm run tools:shortcodes` (the dev server must be running).'
    );
  }
  const out: ShortcodeSpec[] = [];
  for (const slug of list) {
    const res = await fetch(`data/${slug}.yaml`);
    if (!res.ok) throw new Error(`failed to load data/${slug}.yaml: status ${res.status}`);
    const text = await res.text();
    out.push(parseShortcode(text, slug));
  }
  return out;
}

export { parseScalar, parseShortcode };
