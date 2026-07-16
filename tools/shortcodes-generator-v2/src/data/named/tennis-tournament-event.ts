import type { ShortcodeSpec } from "../types";

export const tennisTournamentEvent: ShortcodeSpec = {
  slug: "tennis-tournament-event",
  category: "sports",
  title: "Tennis tournament event",
  description: "Infobox for a tennis tournament event.",
  paired: true,
  upstream:
    "https://en.wikipedia.org/wiki/Template:Infobox_tennis_tournament_event",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Wimbledon men's singles",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "venue", label: "Venue", type: "text", default: "All England Club" },
    {
      key: "surface",
      label: "Surface",
      type: "select",
      options: ["Hard", "Clay", "Grass", "Carpet"],
      default: "Grass",
    },
    { key: "draw", label: "Draw", type: "number" },
    { key: "prize_money", label: "Prize money", type: "text" },
    { key: "founded", label: "Founded", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
