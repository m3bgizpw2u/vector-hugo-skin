import type { ShortcodeSpec } from "../types";

export const footballBiography: ShortcodeSpec = {
  slug: "football-biography",
  category: "biography",
  title: "Football biography",
  description: "Biographical infobox for an association football player.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_football_biography",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Lionel Messi",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "position", label: "Position", type: "text", default: "Forward" },
    {
      key: "clubs",
      label: "Clubs",
      type: "list",
      default: ["Barcelona", "Inter Miami"],
    },
    {
      key: "national_team",
      label: "National team",
      type: "text",
      default: "Argentina",
    },
    { key: "years_active", label: "Years active", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
