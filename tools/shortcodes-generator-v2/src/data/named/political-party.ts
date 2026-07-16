import type { ShortcodeSpec } from "../types";

export const politicalParty: ShortcodeSpec = {
  slug: "political-party",
  category: "org",
  title: "Political party",
  description: "Infobox for a political party.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_political_party",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Green Party of England and Wales",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "leader", label: "Leader", type: "text", default: "Co-leaders" },
    { key: "founded", label: "Founded", type: "text", default: "1990" },
    { key: "hq", label: "Headquarters", type: "text" },
    { key: "ideology", label: "Ideology", type: "list" },
    { key: "website", label: "Website", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
