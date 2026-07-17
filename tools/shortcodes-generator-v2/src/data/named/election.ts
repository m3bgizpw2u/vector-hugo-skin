import type { ShortcodeSpec } from "../types";

export const election: ShortcodeSpec = {
  slug: "election",
  category: "other",
  title: "Election",
  description: "Infobox for an election and its result.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_election",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "2024 United States presidential election",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "country",
      label: "Country",
      type: "text",
      default: "United States",
    },
    { key: "date", label: "Date", type: "date", default: "2024-11-05" },
    { key: "type", label: "Type", type: "text" },
    {
      key: "seats_for_election",
      label: "Seats for election",
      type: "number",
    },
    { key: "turnout", label: "Turnout", type: "text" },
    { key: "result", label: "Result", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
