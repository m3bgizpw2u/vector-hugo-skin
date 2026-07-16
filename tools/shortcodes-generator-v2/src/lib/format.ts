// Output formatting for the generator. Vertical-aligned keys with ` = `
// align columns; compact emits all attrs on one line.

export function formatVertical(slug: string, parts: string[]): string {
  if (parts.length === 0) return `{{< ${slug} >}}{{< /${slug} >}}`;
  const pad = Math.max(...parts.map((p) => p.indexOf(" = "))) + 3;
  const aligned = parts.map((p) => {
    const eq = p.indexOf(" = ");
    return p.slice(0, eq) + " ".repeat(pad - eq) + p.slice(eq);
  });
  return `{{< ${slug}\n    ${aligned.join("\n    ")}\n>}}{{< /${slug} >}}`;
}

export function formatCompact(slug: string, parts: string[]): string {
  if (parts.length === 0) return `{{< ${slug} >}}{{< /${slug} >}}`;
  return `{{< ${slug} ${parts.join(" ")} >}}{{< /${slug} >}}`;
}

// Single-tag form (no body, no closing tag). Used when spec.paired is false.
export function formatSingleTag(slug: string, parts: string[]): string {
  if (parts.length === 0) return `{{< ${slug} >}}`;
  return `{{< ${slug} ${parts.join(" ")} >}}`;
}

export function escapeString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
