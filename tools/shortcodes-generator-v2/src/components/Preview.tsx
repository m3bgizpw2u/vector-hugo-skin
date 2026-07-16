import { useMemo, useState } from "react";
import { useGeneratorStore } from "../state/useGeneratorStore";
import { generate } from "../lib/generate";
import { renderHtml } from "../lib/renderHtml";

export function Preview(): JSX.Element {
  const spec = useGeneratorStore((s) =>
    s.selectedSlug
      ? s.catalog.find((c) => c.slug === s.selectedSlug) ?? null
      : null,
  );
  const values = useGeneratorStore((s) =>
    spec ? s.values[spec.slug] ?? {} : {},
  );
  const customRows = useGeneratorStore((s) =>
    spec ? s.customRows[spec.slug] ?? [] : [],
  );
  const customParams = useGeneratorStore((s) =>
    spec ? s.customParams[spec.slug] ?? [] : [],
  );
  const format = useGeneratorStore((s) => s.format);
  const activeTab = useGeneratorStore((s) => s.activeTab);
  const setActiveTab = useGeneratorStore((s) => s.setActiveTab);
  const [copied, setCopied] = useState(false);

  const source = useMemo(() => {
    if (!spec) return "";
    return generate({ spec, values, customRows, customParams, format });
  }, [spec, values, customRows, customParams, format]);

  const rendered = useMemo(() => {
    if (!spec) return "";
    return renderHtml({ spec, values, customRows, customParams });
  }, [spec, values, customRows, customParams]);

  async function handleCopy(): Promise<void> {
    if (!source) return;
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable; fall back to selecting the source text.
      const el = document.getElementById("preview-source");
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  if (!spec) {
    return (
      <div className="tool-preview">
        <p className="tool-placeholder">Pick a shortcode to see the preview.</p>
      </div>
    );
  }

  return (
    <div className="tool-preview">
      <div className="tool-preview__tabs" role="tablist">
        <button
          type="button"
          className={`tool-preview__tab ${activeTab === "source" ? "is-active" : ""}`}
          onClick={() => setActiveTab("source")}
          role="tab"
          aria-selected={activeTab === "source"}
        >
          Source
        </button>
        <button
          type="button"
          className={`tool-preview__tab ${activeTab === "rendered" ? "is-active" : ""}`}
          onClick={() => setActiveTab("rendered")}
          role="tab"
          aria-selected={activeTab === "rendered"}
        >
          Rendered
        </button>
        <button
          type="button"
          className="tool-preview__copy"
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>
      </div>
      {activeTab === "source" ? (
        <pre id="preview-source" className="tool-preview__source">{source}</pre>
      ) : (
        <div
          id="preview-rendered"
          className="tool-preview__rendered"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      )}
    </div>
  );
}
