import type { ShortcodeSpec } from "../types";

export const school: ShortcodeSpec = {
  slug: "school",
  category: "org",
  title: "School",
  description: "Infobox for a primary or secondary school.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_school",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Springfield High School",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "type",
      label: "Type",
      type: "text",
      default: "Public secondary school",
    },
    { key: "founded", label: "Founded", type: "text", default: "1889" },
    { key: "grades", label: "Grades", type: "text" },
    { key: "enrollment", label: "Enrollment", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
