import { useGeneratorStore } from "../state/useGeneratorStore";
import type { FieldSpec, FieldValue, ShortcodeSpec } from "../data/types";
import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { MarkdownField } from "./fields/MarkdownField";
import { SelectField } from "./fields/SelectField";
import { CheckboxField } from "./fields/CheckboxField";
import { DateField } from "./fields/DateField";
import { NumberField } from "./fields/NumberField";
import { ListField } from "./fields/ListField";
import { ImageField } from "./fields/ImageField";
import { CustomRows } from "./CustomRows";

interface FieldRendererProps {
  spec: ShortcodeSpec;
  field: FieldSpec;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
}

function FieldRenderer({ spec, field, value, onChange }: FieldRendererProps): JSX.Element {
  const props = { spec, field, value, onChange };
  switch (field.type) {
    case "text":
      return <TextField {...props} />;
    case "textarea":
      return <TextareaField {...props} />;
    case "markdown":
      return <MarkdownField {...props} />;
    case "select":
      return <SelectField {...props} />;
    case "checkbox":
      return <CheckboxField {...props} />;
    case "date":
      return <DateField {...props} />;
    case "number":
      return <NumberField {...props} />;
    case "list":
      return <ListField {...props} />;
    case "image":
      return <ImageField {...props} />;
  }
}

function resolveInitial(field: FieldSpec, draft: Record<string, FieldValue> | undefined): FieldValue {
  if (draft && Object.prototype.hasOwnProperty.call(draft, field.key)) {
    return draft[field.key];
  }
  if (field.default === undefined) return "";
  return field.default as FieldValue;
}

export function Form(): JSX.Element {
  const spec = useGeneratorStore((s) =>
    s.selectedSlug ? s.catalog.find((c) => c.slug === s.selectedSlug) ?? null : null,
  );
  const draft = useGeneratorStore((s) => (spec ? s.values[spec.slug] : undefined));
  const setValue = useGeneratorStore((s) => s.setValue);
  const resetValues = useGeneratorStore((s) => s.resetValues);

  if (!spec) {
    return <p className="tool-form__empty">Pick a shortcode from the left.</p>;
  }

  return (
    <>
      <header className="tool-form__header">
        <h2 className="tool-form__title">{spec.title}</h2>
        <p className="tool-form__desc">{spec.description}</p>
        {spec.upstream && (
          <p className="tool-form__meta">
            Upstream:{" "}
            <a href={spec.upstream} target="_blank" rel="noopener noreferrer">
              {spec.upstream}
            </a>
          </p>
        )}
        <p className="tool-form__meta">
          Form: <strong>{spec.paired ? "paired" : "single-tag"}</strong>
        </p>
      </header>
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        {spec.fields.map((field) => {
          const initial = resolveInitial(field, draft);
          return (
            <FieldRenderer
              key={field.key}
              spec={spec}
              field={field}
              value={initial}
              onChange={(v) => setValue(spec.slug, field.key, v)}
            />
          );
        })}
        {spec.allowCustomRows && <CustomRows spec={spec} />}
        <div className="tool-form__actions">
          <button
            type="button"
            className="tool-form__reset"
            onClick={() => resetValues(spec.slug)}
          >
            Reset to defaults
          </button>
        </div>
      </form>
    </>
  );
}