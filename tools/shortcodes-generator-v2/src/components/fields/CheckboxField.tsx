import type { FieldProps } from "./TextField";

export function CheckboxField({ field, value, onChange }: FieldProps): JSX.Element {
  const checked = value === true;
  return (
    <label className="tool-field tool-field--inline">
      <input
        type="checkbox"
        className="tool-field__checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="tool-field__label">
        {field.label}
        {field.required && <span className="tool-field__required" aria-label="required"> *</span>}
      </span>
      {field.hint && <span className="tool-field__hint">{field.hint}</span>}
    </label>
  );
}