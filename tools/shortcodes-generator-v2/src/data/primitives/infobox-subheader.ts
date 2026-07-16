import type { ShortcodeSpec } from "../types";

export const infoboxSubheader: ShortcodeSpec = {
  slug: "infobox-subheader",
  category: "primitive",
  title: "infobox-subheader",
  description:
    "Subtitle line below the infobox title. The paired body takes precedence over value.",
  paired: true,
  upstream: null,
  allowCustomRows: true,
  fields: [
    {
      key: "value",
      label: "Value",
      type: "text",
      hint: "Fallback when the paired body is empty.",
    },
    { key: "class", label: "Class", type: "text" },
    { key: "id", label: "ID", type: "text" },
  ],
};
