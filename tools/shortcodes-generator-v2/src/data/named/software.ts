import type { ShortcodeSpec } from "../types";

export const software: ShortcodeSpec = {
  slug: "software",
  category: "media",
  title: "Software",
  description: "Infobox for a software application or package.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_software",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Hugo",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "developer",
      label: "Developer",
      type: "text",
      default: "The Hugo Authors",
    },
    {
      key: "released",
      label: "Released",
      type: "text",
      default: "2013-07-05",
    },
    { key: "platform", label: "Platform", type: "list" },
    { key: "license", label: "License", type: "text", default: "Apache-2.0" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
