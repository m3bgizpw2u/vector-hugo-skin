import type { ShortcodeSpec } from "../types";

export const footballClub: ShortcodeSpec = {
  slug: "football-club",
  category: "sports",
  title: "Football club",
  description: "Infobox for an association football club.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_football_club",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Manchester United",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "founded", label: "Founded", type: "text", default: "1878" },
    { key: "ground", label: "Ground", type: "text", default: "Old Trafford" },
    { key: "capacity", label: "Capacity", type: "text" },
    { key: "manager", label: "Manager", type: "text" },
    { key: "league", label: "League", type: "text" },
    { key: "website", label: "Website", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
