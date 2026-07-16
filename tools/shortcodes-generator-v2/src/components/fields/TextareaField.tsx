import type { FieldProps } from "./TextField";

export function TextareaField({ field, value, onChange }: FieldProps): JSX.Element {
  return (
    <label className="tool-field">
      <span className="tool-field__label">
        {field.label}
        {field.required && <span className="tool-field__required" aria-label="required"> *</span>}
      </span>
      <textarea
        className="tool-field__input tool-field__input--textarea"
        rows={4}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.hint && <span className="tool-field__hint">{field.hint}</span>}
    </label>
  );
}