import type { ShortcodeSpec } from "../types";

export const televisionEpisode: ShortcodeSpec = {
  slug: "television-episode",
  category: "media",
  title: "Television episode",
  description: "Infobox for an individual television episode.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_television_episode",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Ozymandias",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "series", label: "Series", type: "text", default: "Breaking Bad" },
    { key: "season", label: "Season", type: "number", default: 5 },
    { key: "episode", label: "Episode", type: "number", default: 14 },
    { key: "director", label: "Director", type: "text" },
    { key: "writer", label: "Writer", type: "text" },
    { key: "air_date", label: "Air date", type: "date" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
