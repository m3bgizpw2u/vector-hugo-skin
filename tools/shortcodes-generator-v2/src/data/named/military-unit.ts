import type { ShortcodeSpec } from "../types";

export const militaryUnit: ShortcodeSpec = {
  slug: "military-unit",
  category: "other",
  title: "Military unit",
  description: "Infobox for a military unit or formation.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_military_unit",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "101st Airborne Division",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "branch",
      label: "Branch",
      type: "text",
      default: "United States Army",
    },
    { key: "type", label: "Type", type: "text", default: "Airborne infantry" },
    { key: "role", label: "Role", type: "text" },
    { key: "garrison", label: "Garrison", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
