import type { ShortcodeSpec } from "../types";

export const infoboxImage: ShortcodeSpec = {
  slug: "infobox-image",
  category: "primitive",
  title: "infobox-image",
  description:
    "Single-tag responsive image block with an optional caption and lightbox grouping.",
  paired: false,
  upstream: null,
  allowCustomRows: true,
  fields: [
    { key: "image", label: "Image", type: "image", required: true },
    { key: "alt", label: "Alt", type: "text" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "size", label: "Size", type: "text" },
    { key: "upright", label: "Upright", type: "number", default: 1 },
    { key: "group", label: "Group", type: "text" },
    { key: "class", label: "Class", type: "text" },
  ],
};
