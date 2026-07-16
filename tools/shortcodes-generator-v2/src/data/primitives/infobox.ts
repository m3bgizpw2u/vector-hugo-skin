import type { ShortcodeSpec } from "../types";

export const infobox: ShortcodeSpec = {
  slug: "infobox",
  category: "primitive",
  title: "infobox",
  description:
    "Outer infobox wrapper. Paired form whose body contains rows, sections, subheaders, images, below blocks, or nested infoboxes.",
  paired: true,
  upstream: null,
  allowCustomRows: true,
  fields: [
    {
      key: "type",
      label: "Type",
      type: "text",
      default: "custom",
      hint: "Sets data-infobox-type on the root.",
    },
    { key: "title", label: "Title", type: "text" },
    {
      key: "above",
      label: "Above",
      type: "text",
      hint: "Text rendered above the title.",
    },
    {
      key: "subheaders",
      label: "Subheaders",
      type: "list",
      hint: "One per line; rendered below the title.",
    },
    { key: "title-class", label: "Title class", type: "text" },
    {
      key: "body-class",
      label: "Body class",
      type: "text",
      hint: "Extra CSS class on the outer aside.",
    },
    { key: "child", label: "Child", type: "checkbox", default: false },
    { key: "subbox", label: "Subbox", type: "checkbox", default: false },
    { key: "id", label: "ID", type: "text" },
  ],
};
