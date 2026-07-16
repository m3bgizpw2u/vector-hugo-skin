import type { ShortcodeSpec } from "../types";

export const infoboxRow: ShortcodeSpec = {
  slug: "infobox-row",
  category: "primitive",
  title: "infobox-row",
  description:
    "Label and data row. The paired body takes precedence over the value parameter.",
  paired: true,
  upstream: null,
  allowCustomRows: true,
  fields: [
    { key: "label", label: "Label", type: "text", required: true },
    {
      key: "value",
      label: "Value",
      type: "markdown",
      hint: "Fallback when the paired body is empty.",
    },
    { key: "class", label: "Class", type: "text" },
    { key: "label-class", label: "Label class", type: "text" },
    { key: "data-class", label: "Data class", type: "text" },
    { key: "id", label: "ID", type: "text" },
  ],
};
