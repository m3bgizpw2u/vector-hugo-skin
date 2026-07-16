import type { ShortcodeSpec } from "../types";

export const album: ShortcodeSpec = {
  slug: "album",
  category: "media",
  title: "Album",
  description: "Infobox for a music album or recorded release.",
  paired: true,
  upstream: "https://en.wikipedia.org/wiki/Template:Infobox_album",
  allowCustomRows: true,
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
      default: "OK Computer",
    },
    { key: "image", label: "Image", type: "image" },
    { key: "caption", label: "Caption", type: "markdown" },
    { key: "artist", label: "Artist", type: "text", default: "Radiohead" },
    { key: "released", label: "Released", type: "date", default: "1997-05-21" },
    {
      key: "genre",
      label: "Genre",
      type: "list",
      default: ["Art rock", "Alternative rock"],
    },
    { key: "label", label: "Label", type: "text" },
    { key: "tracks", label: "Tracks", type: "number" },
    { key: "duration", label: "Duration", type: "text" },
    { key: "below", label: "Below", type: "markdown" },
  ],
};
