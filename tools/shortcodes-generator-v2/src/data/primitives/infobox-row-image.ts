import type { ShortcodeSpec } from "../types";

export const infoboxRowImage: ShortcodeSpec = {
  slug: "infobox-row-image",
  category: "primitive",
  title: "infobox-row-image",
  description:
    "Data row with a lightbox-enabled inline thumbnail and optional Markdown body.",
  paired: true,
  upstream: null,
  allowCustomRows: true,
  fields: [
    { key: "label", label: "Label", type: "text" },
    { key: "image", label: "Image", type: "image", required: true },
    { key: "image-alt", label: "Image alt", type: "text" },
    { key: "image-caption", label: "Image caption", type: "markdown" },
    {
      key: "image-upright",
      label: "Image upright",
      type: "number",
      default: 1,
    },
    { key: "group", label: "Group", type: "text", default: "default" },
    { key: "value", label: "Value", type: "markdown" },
    { key: "class", label: "Class", type: "text" },
  ],
};
