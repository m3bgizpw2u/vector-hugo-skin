import type { FieldProps } from "./TextField";

export function DateField({ field, value, onChange }: FieldProps): JSX.Element {
  return (
    <label className="tool-field">
      <span className="tool-field__label">
        {field.label}
        {field.required && <span className="tool-field__required" aria-label="required"> *</span>}
      </span>
      <input
        type="date"
        className="tool-field__input"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.hint && <span className="tool-field__hint">{field.hint}</span>}
    </label>
  );
}