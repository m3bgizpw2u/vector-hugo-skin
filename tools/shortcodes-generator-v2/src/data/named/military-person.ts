import type { ShortcodeSpec } from "../types";

export const militaryPerson: ShortcodeSpec = {
  slug: "military-person",
  category: "biography",
  title: "Military person",
  description: "Biographical infobox focused on military service.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_military_person",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "George S. Patton",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "branch",
      label: "Branch",
      type: "text",
      default: "United States Army",
    },
    {
      key: "service_years",
      label: "Service years",
      type: "text",
      default: "1909–1945",
    },
    { key: "rank", label: "Rank", type: "text", default: "General" },
    { key: "battles", label: "Battles", type: "list" },
    { key: "awards", label: "Awards", type: "list" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
