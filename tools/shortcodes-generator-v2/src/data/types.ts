export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "select"
  | "checkbox"
  | "date"
  | "number"
  | "list"
  | "image";

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  options?: string[];
  default?: string | number | boolean | string[];
}

export type FieldValue = string | number | boolean | string[] | null;

export type CustomRowKind = "text" | "markdown" | "image" | "link";

export interface CustomRow {
  id: string;
  label: string;
  kind: CustomRowKind;
  value: string;
}

export interface CustomParam {
  id: string;
  key: string;
  value: string;
}

export type ShortcodeCategory =
  | "primitive"
  | "biography"
  | "geography"
  | "media"
  | "org"
  | "sports"
  | "other";

export interface ShortcodeSpec {
  slug: string;
  category: ShortcodeCategory;
  title: string;
  description: string;
  paired: boolean;
  upstream: string | null;
  fields: FieldSpec[];
  allowCustomRows?: boolean;
}

export interface GeneratorState {
  catalog: ShortcodeSpec[];
  selectedSlug: string | null;
  format: "vertical" | "compact";
  theme: "light" | "dark";
  activeTab: "source" | "rendered";
  values: Record<string, Record<string, FieldValue>>;
  customRows: Record<string, CustomRow[]>;
  customParams: Record<string, CustomParam[]>;
}
