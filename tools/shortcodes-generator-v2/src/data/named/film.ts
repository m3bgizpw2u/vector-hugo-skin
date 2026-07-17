import type { ShortcodeSpec } from "../types";

export const film: ShortcodeSpec = {
  slug: "film",
  category: "media",
  title: "Film",
  description: "Infobox for a motion picture.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_film",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "A Trip to the Moon",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "director",
      label: "Director",
      type: "text",
      default: "Georges Méliès",
    },
    { key: "released", label: "Released", type: "text", default: "1902" },
    { key: "runtime", label: "Runtime", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "language", label: "Language", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
