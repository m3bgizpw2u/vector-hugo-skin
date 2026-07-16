import type { ShortcodeSpec } from "../types";

export const historicSite: ShortcodeSpec = {
  slug: "historic-site",
  category: "geography",
  title: "Historic site",
  description: "Infobox for a historic building, landmark, or registered site.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_NRHP",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Empire State Building",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "location",
      label: "Location",
      type: "text",
      default: "New York City, United States",
    },
    { key: "built", label: "Built", type: "text", default: "1930–1931" },
    {
      key: "architect",
      label: "Architect",
      type: "text",
      default: "Shreve, Lamb and Harmon",
    },
    { key: "style", label: "Style", type: "text" },
    { key: "governing_body", label: "Governing body", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
