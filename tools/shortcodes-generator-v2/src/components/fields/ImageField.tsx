import { useId, useRef } from "react";
import type { FieldProps } from "./TextField";

// Auto-detect URL-mode from the value prefix. Filenames and bundled assets
// (e.g. "ada.png", "/media/ada.jpg", "people/ada.jpg") fall through to file-mode.
// Anything starting with a scheme or protocol-relative URL is URL-mode.
function isUrlValue(v: string): boolean {
  if (!v) return false;
  return /^(https?:|data:|\/\/)/i.test(v);
}

export function ImageField({ field, value, onChange }: FieldProps): JSX.Element {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const current = typeof value === "string" ? value : "";
  const urlMode = isUrlValue(current);

  return (
    <div className="tool-field tool-field--image">
      <span className="tool-field__label">
        {field.label}
        {field.required && <span className="tool-field__required" aria-label="required"> *</span>}
      </span>
      <div className="tool-field__row tool-field__row--image">
        <input
          type="text"
          id={inputId}
          className={`tool-field__input tool-field__input--file${urlMode ? " is-inactive" : ""}`}
          placeholder="image-filename.png"
          value={urlMode ? "" : current}
          aria-label={`${field.label} (file)`}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="tool-field__btn"
          onClick={() => fileRef.current?.click()}
          tabIndex={urlMode ? -1 : 0}
        >
          Browse…
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="tool-field__file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file.name);
            e.target.value = "";
          }}
        />
        <input
          type="url"
          className={`tool-field__input tool-field__input--url${urlMode ? "" : " is-inactive"}`}
          placeholder="https://…"
          value={urlMode ? current : ""}
          aria-label={`${field.label} (URL)`}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {field.hint && <span className="tool-field__hint">{field.hint}</span>}
    </div>
  );
}