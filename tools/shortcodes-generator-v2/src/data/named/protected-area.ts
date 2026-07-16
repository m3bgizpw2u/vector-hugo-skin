import type { ShortcodeSpec } from "../types";

export const protectedArea: ShortcodeSpec = {
  slug: "protected-area",
  category: "geography",
  title: "Protected area",
  description: "Infobox for a national park or other protected area.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_protected_area",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Yellowstone National Park",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "location",
      label: "Location",
      type: "text",
      default: "Wyoming, Montana, and Idaho",
    },
    { key: "area", label: "Area", type: "text", default: "8,983.18 km²" },
    {
      key: "established",
      label: "Established",
      type: "text",
      default: "1 March 1872",
    },
    { key: "governing_body", label: "Governing body", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
