import type { ShortcodeSpec } from '../types';

export const quickRow: ShortcodeSpec = {
  slug: 'quick-row',
  category: 'primitive',
  title: 'quick-row',
  description:
    'Lightweight alternative to {{< row >}} — title is the only required field. text and image are both optional. image2= renders a small image into the icon slot at icon scale. href= turns the text cell into a clickable link.',
  paired: false,
  upstream: null,
  allowCustomRows: false,
  fields: [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      hint: 'Row heading; also used as aria-label when href is set.',
    },
    {
      key: 'text',
      label: 'Text',
      type: 'markdown',
      hint: 'Markdown body; omit to skip the text slot.',
    },
    {
      key: 'image',
      label: 'Image',
      type: 'image',
      hint: 'Image path or URL; omit to skip the photo cell.',
    },
    {
      key: 'icon',
      label: 'Icon',
      type: 'text',
      hint: 'SVG filename under layouts/partials/icons/. Mutually exclusive with image2; image2 takes priority.',
    },
    {
      key: 'image2',
      label: 'Image for icon slot',
      type: 'image',
      hint: 'Small image rendered into the icon slot at icon scale (clamp 2.5–4rem). Takes priority over icon=.',
    },
    { key: 'alt', label: 'Alt text', type: 'text', hint: 'img alt for the photo cell; defaults to title.' },
    {
      key: 'image2alt',
      label: 'Alt text (image2)',
      type: 'text',
      hint: 'img alt for the image2 cell; falls back to alt.',
    },
    {
      key: 'href',
      label: 'Link URL',
      type: 'text',
      hint: 'When set, the text cell becomes a clickable link.',
    },
    {
      key: 'lightbox',
      label: 'Lightbox',
      type: 'checkbox',
      default: false,
      hint: 'Opts the photo into the lightbox overlay.',
    },
    {
      key: 'image2lightbox',
      label: 'Image2 lightbox',
      type: 'checkbox',
      default: false,
      hint: 'Opts image2 into the lightbox overlay.',
    },
    {
      key: 'group',
      label: 'Lightbox group',
      type: 'text',
      hint: 'Lightbox carousel key; inherits from parent row-table when not set.',
    },
  ],
};
