import type { ShortcodeSpec } from "../types";

export const televisionSeason: ShortcodeSpec = {
  slug: "television-season",
  category: "media",
  title: "Television season",
  description: "Infobox for a season of a television series.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_television_season",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Breaking Bad — Season 5",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "series", label: "Series", type: "text", default: "Breaking Bad" },
    { key: "season", label: "Season", type: "number", default: 5 },
    { key: "episodes", label: "Episodes", type: "number", default: 16 },
    { key: "first_aired", label: "First aired", type: "date" },
    { key: "last_aired", label: "Last aired", type: "date" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
