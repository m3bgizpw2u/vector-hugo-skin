import type { ShortcodeSpec } from '../types';

export const row: ShortcodeSpec = {
  slug: 'row',
  category: 'primitive',
  title: 'row',
  description:
    'Inner primitive — one data row inside a {{< row-table >}} parent. Renders the icon | text | photo triple. image2= renders a small image into the icon slot at icon scale.',
  paired: false,
  upstream: null,
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'text', label: 'Text', type: 'textarea', required: true },
    { key: 'image', label: 'Image', type: 'image', required: true, hint: 'Photo filename under static/media/.' },
    { key: 'icon', label: 'Icon', type: 'text', hint: 'SVG filename under layouts/partials/icons/. Mutually exclusive with image2; image2 takes priority.' },
    {
      key: 'image2',
      label: 'Image for icon slot',
      type: 'image',
      hint: 'Small image rendered into the icon slot at icon scale (clamp 2.5–4rem). Takes priority over icon=.',
    },
    { key: 'alt', label: 'Alt text', type: 'text', hint: 'img alt for the main photo; falls back to title.' },
    {
      key: 'image2alt',
      label: 'Alt text (image2)',
      type: 'text',
      hint: 'img alt for the image2 cell; falls back to alt.',
    },
    {
      key: 'lightbox',
      label: 'Lightbox',
      type: 'checkbox',
      default: false,
      hint: 'Opts the main photo into the lightbox overlay.',
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
      hint: 'Lightbox carousel key; inherits from parent row-table when omitted.',
    },
  ],
};
