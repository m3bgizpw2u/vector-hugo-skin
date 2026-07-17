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
    { key: "series_name", label: "Series", type: "text", default: "Breaking Bad" },
    { key: "season_number", label: "Season number", type: "text", default: "5" },
    { key: "num_episodes", label: "Episodes", type: "text", default: "16" },
    { key: "first_aired", label: "First aired", type: "text" },
    { key: "last_aired", label: "Last aired", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
