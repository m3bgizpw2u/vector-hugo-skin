import type { ShortcodeSpec } from "../types";

export const videoGame: ShortcodeSpec = {
  slug: "video-game",
  category: "media",
  title: "Video game",
  description: "Infobox for a video game release.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_video_game",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "Hades",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    {
      key: "developer",
      label: "Developer",
      type: "text",
      default: "Supergiant Games",
    },
    {
      key: "publisher",
      label: "Publisher",
      type: "text",
      default: "Supergiant Games",
    },
    {
      key: "released",
      label: "Released",
      type: "text",
      default: "2020-09-17",
    },
    { key: "platform", label: "Platform", type: "list" },
    { key: "genre", label: "Genre", type: "list" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
