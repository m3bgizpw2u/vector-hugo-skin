import { useMemo } from "react";
import type { FieldProps } from "./TextField";

export function ListField({ field, value, onChange }: FieldProps): JSX.Element {
  const text = useMemo(() => {
    if (Array.isArray(value)) return value.join("\n");
    if (typeof value === "string") return value;
    return "";
  }, [value]);

  return (
    <label className="tool-field">
      <span className="tool-field__label">
        {field.label}
        {field.required && <span className="tool-field__required" aria-label="required"> *</span>}
      </span>
      <textarea
        className="tool-field__input tool-field__input--textarea"
        rows={4}
        value={text}
        onChange={(e) => {
          const lines = e.target.value
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
          onChange(lines);
        }}
      />
      <span className="tool-field__hint">
        {field.hint ? `${field.hint} · ` : ""}One per line
      </span>
    </label>
  );
}