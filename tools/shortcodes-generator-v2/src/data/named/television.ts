import type { ShortcodeSpec } from "../types";

export const television: ShortcodeSpec = {
  slug: "television",
  category: "media",
  title: "Television",
  description: "Infobox for a television program or series.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_television",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Severance",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "network", label: "Network", type: "text", default: "Apple TV+" },
    {
      key: "first_aired",
      label: "First aired",
      type: "date",
      default: "2022-02-18",
    },
    { key: "last_aired", label: "Last aired", type: "date" },
    { key: "seasons", label: "Seasons", type: "number", default: 2 },
    { key: "episodes", label: "Episodes", type: "number" },
    { key: "genre", label: "Genre", type: "list" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
