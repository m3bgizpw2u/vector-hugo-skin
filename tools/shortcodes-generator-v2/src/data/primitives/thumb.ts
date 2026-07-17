import type { ShortcodeSpec } from '../types';

export const thumb: ShortcodeSpec = {
  slug: 'thumb',
  category: 'primitive',
  title: 'thumb',
  description:
    'Inline article-body thumbnail — Wikipedia-style right-aligned image with float, native-ratio rendering, magnify + lightbox hooks. Always routes through the shared article/thumb.html partial.',
  paired: true,
  upstream: null,
  fields: [
    {
      key: 'src',
      label: 'Source',
      type: 'image',
      required: true,
      hint: 'Image URL (remote http(s)://) or a site-relative / assets-relative path.',
    },
    {
      key: 'alt',
      label: 'Alt text',
      type: 'text',
      hint: 'alt text; empty is valid for a decorative image.',
    },
    {
      key: 'caption',
      label: 'Caption',
      type: 'markdown',
      hint: 'Caption markup; markdownified so inline links / emphasis work. Ignored when .Inner is non-empty (the paired body wins).',
    },
    {
      key: 'align',
      label: 'Alignment',
      type: 'select',
      options: ['right', 'left', 'none'],
      default: 'right',
      hint: 'right = Wikipedia default-thumb placement; left = mirror; none = no float.',
    },
    {
      key: 'width',
      label: 'Width',
      type: 'text',
      hint: 'CSS length cap for the desktop container; also feeds the partial sizes hint. Leave empty to use the default.',
    },
    {
      key: 'lightbox',
      label: 'Lightbox',
      type: 'checkbox',
      default: false,
      hint: 'Opts into the lightbox overlay + magnify button.',
    },
    {
      key: 'group',
      label: 'Lightbox group',
      type: 'text',
      hint: 'Lightbox carousel key; only meaningful when lightbox is enabled.',
    },
  ],
};
