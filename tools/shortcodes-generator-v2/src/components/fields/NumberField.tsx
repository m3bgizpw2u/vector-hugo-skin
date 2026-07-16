import type { FieldProps } from "./TextField";

export function NumberField({ field, value, onChange }: FieldProps): JSX.Element {
  return (
    <label className="tool-field">
      <span className="tool-field__label">
        {field.label}
        {field.required && <span className="tool-field__required" aria-label="required"> *</span>}
      </span>
      <input
        type="number"
        className="tool-field__input"
        value={typeof value === "number" ? value : value === "" ? "" : Number(value)}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange("");
            return;
          }
          const n = Number(raw);
          onChange(Number.isFinite(n) ? n : raw);
        }}
      />
      {field.hint && <span className="tool-field__hint">{field.hint}</span>}
    </label>
  );
}