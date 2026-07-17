import type { ShortcodeSpec } from "../types";

export const award: ShortcodeSpec = {
  slug: "award",
  category: "media",
  title: "Award",
  description: "Infobox for an award, honor, or prize.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_award",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Academy Award for Best Picture",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "country",
      label: "Country",
      type: "text",
      default: "United States",
    },
    {
      key: "presenter",
      label: "Presented by",
      type: "text",
      default: "Academy of Motion Picture Arts and Sciences",
    },
    {
      key: "firstawarded",
      label: "First awarded",
      type: "text",
      default: "1929",
    },
    { key: "website", label: "Website", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
