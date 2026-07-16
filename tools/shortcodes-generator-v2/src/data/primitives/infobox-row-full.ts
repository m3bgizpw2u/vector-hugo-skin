import type { ShortcodeSpec } from "../types";

export const infoboxRowFull: ShortcodeSpec = {
  slug: "infobox-row-full",
  category: "primitive",
  title: "infobox-row-full",
  description:
    "Label-free, full-width data row for Markdown content such as cast lists or citations.",
  paired: true,
  upstream: null,
  allowCustomRows: true,
  fields: [
    {
      key: "value",
      label: "Value",
      type: "markdown",
      hint: "Fallback when the paired body is empty.",
    },
    { key: "class", label: "Class", type: "text" },
    { key: "id", label: "ID", type: "text" },
  ],
};
