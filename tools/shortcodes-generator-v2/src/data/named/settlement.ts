import type { ShortcodeSpec } from "../types";

export const settlement: ShortcodeSpec = {
  slug: "settlement",
  category: "geography",
  title: "Settlement",
  description: "Infobox for a city, town, village, or other settlement.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_settlement",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "London",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "country",
      label: "Country",
      type: "text",
      default: "United Kingdom",
    },
    {
      key: "population_total",
      label: "Population",
      type: "text",
      default: "8982000",
    },
    { key: "area_total_km2", label: "Area (km²)", type: "text" },
    { key: "elevation_m", label: "Elevation (m)", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
