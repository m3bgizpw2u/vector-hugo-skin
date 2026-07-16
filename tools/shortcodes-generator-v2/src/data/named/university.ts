import type { ShortcodeSpec } from "../types";

export const university: ShortcodeSpec = {
  slug: "university",
  category: "org",
  title: "University",
  description: "Infobox for a university or college.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_university",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Massachusetts Institute of Technology",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "type",
      label: "Type",
      type: "text",
      default: "Private research university",
    },
    { key: "established", label: "Established", type: "text", default: "1861" },
    { key: "students", label: "Students", type: "text" },
    { key: "campus", label: "Campus", type: "text" },
    { key: "motto", label: "Motto", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
