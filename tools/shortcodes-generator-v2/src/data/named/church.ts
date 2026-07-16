import type { ShortcodeSpec } from "../types";

export const church: ShortcodeSpec = {
  slug: "church",
  category: "org",
  title: "Church",
  description: "Infobox for a church or religious congregation.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_church",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "St. Patrick's Cathedral",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "denomination",
      label: "Denomination",
      type: "text",
      default: "Catholic",
    },
    { key: "founded", label: "Founded", type: "text", default: "1809" },
    { key: "location", label: "Location", type: "text" },
    { key: "members", label: "Members", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
