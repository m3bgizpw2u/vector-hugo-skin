// Shared types for the shortcodes-generator.

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'number'
  | 'box'
  | 'markdown'
  | 'image';

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  options?: string[]; // for `select`
}

export type FieldValue = string | number | boolean | string[] | null;

export interface ShortcodeSpec {
  slug: string;
  category: string;
  title: string;
  description: string;
  upstream: string | null;
  worked_example: string;
  fields: FieldSpec[];
  defaults: Record<string, FieldValue>;
}
