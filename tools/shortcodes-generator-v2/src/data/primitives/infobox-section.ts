import type { ShortcodeSpec } from "../types";

export const infoboxSection: ShortcodeSpec = {
  slug: "infobox-section",
  category: "primitive",
  title: "infobox-section",
  description:
    "Section divider spanning both infobox columns. The paired body is a fallback for title.",
  paired: true,
  upstream: null,
  allowCustomRows: true,
  fields: [
    {
      key: "title",
      label: "Title",
      type: "text",
      hint: "Falls back to the paired body when empty.",
    },
    { key: "class", label: "Class", type: "text" },
  ],
};
