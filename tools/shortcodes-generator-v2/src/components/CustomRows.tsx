import { useGeneratorStore } from "../state/useGeneratorStore";
import type { ShortcodeSpec, CustomRowKind } from "../data/types";

interface CustomRowsProps {
  spec: ShortcodeSpec;
}

const ROW_KINDS: { value: CustomRowKind; label: string; placeholder: string; multiline: boolean }[] = [
  { value: "markdown", label: "Markdown", placeholder: "Value (Markdown; supports nested shortcodes)", multiline: true },
  { value: "text", label: "Text", placeholder: "Plain text value", multiline: false },
  { value: "link", label: "Link", placeholder: "https://…", multiline: false },
  { value: "image", label: "Image", placeholder: "Image URL or filename", multiline: false },
];

function kindMeta(kind: CustomRowKind): typeof ROW_KINDS[number] {
  return ROW_KINDS.find((k) => k.value === kind) ?? ROW_KINDS[0];
}

export function CustomRows({ spec }: CustomRowsProps): JSX.Element {
  const rows = useGeneratorStore((s) => s.customRows[spec.slug] ?? []);
  const params = useGeneratorStore((s) => s.customParams[spec.slug] ?? []);

  const addCustomRow = useGeneratorStore((s) => s.addCustomRow);
  const removeCustomRow = useGeneratorStore((s) => s.removeCustomRow);
  const updateCustomRow = useGeneratorStore((s) => s.updateCustomRow);
  const reorderCustomRows = useGeneratorStore((s) => s.reorderCustomRows);

  const addCustomParam = useGeneratorStore((s) => s.addCustomParam);
  const removeCustomParam = useGeneratorStore((s) => s.removeCustomParam);
  const updateCustomParam = useGeneratorStore((s) => s.updateCustomParam);

  return (
    <section className="tool-custom" aria-label="Custom rows and params">
      <div className="tool-custom__section">
        <h3 className="tool-custom__heading">Custom rows</h3>
        <p className="tool-custom__hint">
          Free-form label/value rows. Markdown rows support inline Hugo shortcodes (e.g.&nbsp;
          <code>{'{{< infobox-image src="…" >}}'}</code>); link and image kinds embed the URL directly.
        </p>
        {rows.length === 0 && <p className="tool-custom__hint">No custom rows yet.</p>}
        <ol className="tool-custom__list">
          {rows.map((row, i) => {
            const meta = kindMeta(row.kind);
            return (
              <li key={row.id} className="tool-custom__row">
                <div className="tool-custom__row-grid">
                  <input
                    type="text"
                    className="tool-custom__input"
                    placeholder="Label"
                    value={row.label}
                    onChange={(e) => updateCustomRow(spec.slug, row.id, { label: e.target.value })}
                  />
                  <div className="tool-custom__kind">
                    <label htmlFor={`row-kind-${row.id}`} className="tool-custom__kind-label">
                      Kind
                    </label>
                    <select
                      id={`row-kind-${row.id}`}
                      className="tool-custom__select"
                      value={row.kind}
                      onChange={(e) =>
                        updateCustomRow(spec.slug, row.id, {
                          kind: e.target.value as CustomRowKind,
                        })
                      }
                    >
                      {ROW_KINDS.map((k) => (
                        <option key={k.value} value={k.value}>
                          {k.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {meta.multiline ? (
                  <textarea
                    className="tool-custom__textarea"
                    placeholder={meta.placeholder}
                    rows={3}
                    value={row.value}
                    onChange={(e) => updateCustomRow(spec.slug, row.id, { value: e.target.value })}
                  />
                ) : (
                  <input
                    type={row.kind === "link" ? "url" : row.kind === "image" ? "text" : "text"}
                    className="tool-custom__input"
                    placeholder={meta.placeholder}
                    value={row.value}
                    onChange={(e) => updateCustomRow(spec.slug, row.id, { value: e.target.value })}
                  />
                )}
                <div className="tool-custom__controls">
                  <button
                    type="button"
                    className="tool-custom__btn"
                    onClick={() => reorderCustomRows(spec.slug, i, i - 1)}
                    disabled={i === 0}
                    aria-label="Move row up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="tool-custom__btn"
                    onClick={() => reorderCustomRows(spec.slug, i, i + 1)}
                    disabled={i === rows.length - 1}
                    aria-label="Move row down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="tool-custom__btn tool-custom__btn--danger"
                    onClick={() => removeCustomRow(spec.slug, row.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          className="tool-custom__add"
          onClick={() => addCustomRow(spec.slug)}
        >
          + Add row
        </button>
      </div>

      <div className="tool-custom__section">
        <h3 className="tool-custom__heading">Custom params</h3>
        <p className="tool-custom__hint">
          Free-form Hugo shortcode attributes emitted alongside the spec&rsquo;s declared fields
          (e.g.&nbsp;<code>class=&quot;…&quot;</code>, <code>id=&quot;…&quot;</code>).
        </p>
        {params.length === 0 && <p className="tool-custom__hint">No custom params yet.</p>}
        <ol className="tool-custom__list">
          {params.map((p) => (
            <li key={p.id} className="tool-custom__param">
              <input
                type="text"
                className="tool-custom__input"
                placeholder="key"
                value={p.key}
                onChange={(e) => updateCustomParam(spec.slug, p.id, { key: e.target.value })}
              />
              <input
                type="text"
                className="tool-custom__input"
                placeholder="value"
                value={p.value}
                onChange={(e) => updateCustomParam(spec.slug, p.id, { value: e.target.value })}
              />
              <button
                type="button"
                className="tool-custom__btn tool-custom__btn--danger"
                onClick={() => removeCustomParam(spec.slug, p.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="tool-custom__add"
          onClick={() => addCustomParam(spec.slug)}
        >
          + Add param
        </button>
      </div>
    </section>
  );
}