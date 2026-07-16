import type { ShortcodeSpec } from "../types";

export const iceHockeyBiography: ShortcodeSpec = {
  slug: "ice-hockey-biography",
  category: "biography",
  title: "Ice hockey biography",
  description: "Biographical infobox for an ice hockey player.",
  paired: true,
  upstream:
    "https://en.wikipedia.org/wiki/Template:Infobox_ice_hockey_biography",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Connor McDavid",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "position", label: "Position", type: "text", default: "Center" },
    { key: "team", label: "Team", type: "text", default: "Edmonton Oilers" },
    {
      key: "national_team",
      label: "National team",
      type: "text",
      default: "Canada",
    },
    { key: "years_active", label: "Years active", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
