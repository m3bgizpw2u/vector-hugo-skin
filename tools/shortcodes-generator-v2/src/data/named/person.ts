import type { ShortcodeSpec } from "../types";

export const person: ShortcodeSpec = {
  slug: "person",
  category: "biography",
  title: "Person",
  description: "Biographical infobox for a notable person.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_person",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Ada Lovelace",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "birth_date",
      label: "Birth date",
      type: "date",
      default: "1815-12-10",
    },
    {
      key: "birth_place",
      label: "Birth place",
      type: "text",
      default: "London, England",
    },
    { key: "death_date", label: "Death date", type: "date" },
    { key: "death_place", label: "Death place", type: "text" },
    { key: "nationality", label: "Nationality", type: "text" },
    {
      key: "occupation",
      label: "Occupation",
      type: "list",
      default: ["Mathematician", "Writer"],
    },
    { key: "known_for", label: "Known for", type: "text" },
    { key: "website", label: "Website", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
