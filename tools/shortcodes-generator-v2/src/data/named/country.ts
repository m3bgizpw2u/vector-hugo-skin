import type { ShortcodeSpec } from "../types";

export const country: ShortcodeSpec = {
  slug: "country",
  category: "geography",
  title: "Country",
  description: "Infobox for a sovereign state or country.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_country",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "France",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "capital", label: "Capital", type: "text", default: "Paris" },
    {
      key: "population",
      label: "Population",
      type: "text",
      default: "68070000",
    },
    { key: "area", label: "Area", type: "text" },
    { key: "government", label: "Government", type: "text" },
    { key: "language", label: "Language", type: "text", default: "French" },
    { key: "currency", label: "Currency", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
