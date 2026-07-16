import type { ShortcodeSpec } from "../types";

export const infoboxBelow: ShortcodeSpec = {
  slug: "infobox-below",
  category: "primitive",
  title: "infobox-below",
  description: "Markdown footer block rendered at the bottom of an infobox.",
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
