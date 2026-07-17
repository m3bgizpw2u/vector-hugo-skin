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
    { key: "first_aired", label: "First aired", type: "text" },
    { key: "last_aired", label: "Last aired", type: "text" },
    { key: "num_seasons", label: "Seasons", type: "text", default: "2" },
    { key: "num_episodes", label: "Episodes", type: "text" },
    { key: "genre", label: "Genre", type: "list" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
