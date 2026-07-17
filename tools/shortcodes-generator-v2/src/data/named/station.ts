import type { ShortcodeSpec } from "../types";

export const station: ShortcodeSpec = {
  slug: "station",
  category: "geography",
  title: "Station",
  description: "Infobox for a railway, metro, or other transit station.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_station",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "London Waterloo",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "location",
      label: "Location",
      type: "text",
      default: "London, United Kingdom",
    },
    { key: "platforms", label: "Platforms", type: "text", default: "2" },
    { key: "opened", label: "Opened", type: "text", default: "11 July 1848" },
    { key: "operator", label: "Operator", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
