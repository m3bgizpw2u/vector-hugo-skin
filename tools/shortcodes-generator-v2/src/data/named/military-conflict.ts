import type { ShortcodeSpec } from "../types";

export const militaryConflict: ShortcodeSpec = {
  slug: "military-conflict",
  category: "other",
  title: "Military conflict",
  description: "Infobox for a battle, war, or military conflict.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_military_conflict",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Battle of Gettysburg",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "date", label: "Date", type: "text", default: "1–3 July 1863" },
    {
      key: "location",
      label: "Location",
      type: "text",
      default: "Gettysburg, Pennsylvania",
    },
    { key: "result", label: "Result", type: "text" },
    { key: "belligerents", label: "Belligerents", type: "list" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
