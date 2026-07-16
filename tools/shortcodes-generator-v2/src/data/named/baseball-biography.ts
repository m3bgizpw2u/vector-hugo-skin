import type { ShortcodeSpec } from "../types";

export const baseballBiography: ShortcodeSpec = {
  slug: "baseball-biography",
  category: "biography",
  title: "Baseball biography",
  description: "Biographical infobox for a baseball player.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_baseball_biography",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Babe Ruth",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "position",
      label: "Position",
      type: "text",
      default: "Outfielder, pitcher",
    },
    {
      key: "bats_throws",
      label: "Bats / throws",
      type: "text",
      default: "Left / Left",
    },
    { key: "team", label: "Team", type: "text", default: "New York Yankees" },
    { key: "years_active", label: "Years active", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
