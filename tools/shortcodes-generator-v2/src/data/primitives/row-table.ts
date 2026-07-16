import type { ShortcodeSpec } from '../types';

export const rowTable: ShortcodeSpec = {
  slug: 'row-table',
  category: 'primitive',
  title: 'row-table',
  description: 'Paired parent shortcode — wraps a stack of {{< row >}} children in a labelled section with optional eyebrow, title, description, and footer.',
  paired: true,
  upstream: null,
  allowCustomRows: true,
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', hint: 'Small kicker label rendered above the title.' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'level', label: 'Heading level', type: 'number', default: 3, hint: 'Heading level (2-6) for the section title.' },
    { key: 'description', label: 'Description', type: 'markdown' },
    { key: 'footer', label: 'Footer', type: 'markdown' },
    {
      key: 'variant',
      label: 'Variant',
      type: 'select',
      options: ['compact', 'expandable'],
      hint: 'compact = dense layout; expandable = reveal/hide toggle.',
    },
    { key: 'group', label: 'Lightbox group', type: 'text', hint: 'Default lightbox carousel key inherited by child rows.' },
  ],
};
