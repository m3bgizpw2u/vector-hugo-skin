import type { FieldProps } from "./TextField";

export function SelectField({ field, value, onChange }: FieldProps): JSX.Element {
  const options = field.options ?? [];
  const current = typeof value === "string" ? value : "";
  return (
    <label className="tool-field">
      <span className="tool-field__label">
        {field.label}
        {field.required && <span className="tool-field__required" aria-label="required"> *</span>}
      </span>
      <select
        className="tool-field__input tool-field__input--select"
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">(empty)</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {field.hint && <span className="tool-field__hint">{field.hint}</span>}
    </label>
  );
}