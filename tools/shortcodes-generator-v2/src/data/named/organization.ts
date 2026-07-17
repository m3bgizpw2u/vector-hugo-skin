import type { ShortcodeSpec } from "../types";

export const organization: ShortcodeSpec = {
  slug: "organization",
  category: "org",
  title: "Organization",
  description: "Infobox for a nonprofit, association, or other organization.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_organization",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Wikimedia Foundation",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "type",
      label: "Type",
      type: "text",
      default: "Nonprofit organization",
    },
    { key: "founded", label: "Founded", type: "text", default: "20 June 2003" },
    { key: "headquarters", label: "Headquarters", type: "text" },
    { key: "members", label: "Members", type: "text" },
    { key: "website", label: "Website", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
