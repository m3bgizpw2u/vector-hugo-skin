import type { ShortcodeSpec } from "../types";

export const company: ShortcodeSpec = {
  slug: "company",
  category: "org",
  title: "Company",
  description: "Infobox for a company or corporation.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_company",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Acme Corporation",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "industry",
      label: "Industry",
      type: "text",
      default: "Manufacturing",
    },
    { key: "founded", label: "Founded", type: "text", default: "1907" },
    { key: "founder", label: "Founder", type: "text" },
    { key: "hq", label: "Headquarters", type: "text" },
    { key: "website", label: "Website", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
