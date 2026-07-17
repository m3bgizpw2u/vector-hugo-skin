import type { ShortcodeSpec } from "../types";

export const basketballBiography: ShortcodeSpec = {
  slug: "basketball-biography",
  category: "biography",
  title: "Basketball biography",
  description: "Biographical infobox for a basketball player.",
  paired: true,
  upstream:
    "https://en.wikipedia.org/wiki/Template:Infobox_basketball_biography",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Lisa Leslie",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "position", label: "Position", type: "text", default: "Center" },
    { key: "height", label: "Height", type: "text", default: "1.96 m" },
    { key: "nationalteam", label: "National team", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
