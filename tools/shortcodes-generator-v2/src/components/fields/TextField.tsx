import type { FieldSpec, FieldValue, ShortcodeSpec } from "../../data/types";

export interface FieldProps {
  spec: ShortcodeSpec;
  field: FieldSpec;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
}

export function TextField({ field, value, onChange }: FieldProps): JSX.Element {
  return (
    <label className="tool-field">
      <span className="tool-field__label">
        {field.label}
        {field.required && <span className="tool-field__required" aria-label="required"> *</span>}
      </span>
      <input
        type="text"
        className="tool-field__input"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.hint && <span className="tool-field__hint">{field.hint}</span>}
    </label>
  );
}