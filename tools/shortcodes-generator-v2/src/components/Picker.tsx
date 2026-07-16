import { useMemo, useState } from "react";
import { useGeneratorStore } from "../state/useGeneratorStore";
import type { ShortcodeSpec, ShortcodeCategory } from "../data/types";

const CATEGORY_LABELS: Record<ShortcodeCategory, string> = {
  primitive: "Primitives",
  biography: "Biography",
  geography: "Geography",
  media: "Media",
  org: "Organizations",
  sports: "Sports",
  other: "Other",
};

const CATEGORY_ORDER: ShortcodeCategory[] = [
  "primitive",
  "biography",
  "geography",
  "media",
  "org",
  "sports",
  "other",
];

export function Picker(): JSX.Element {
  const catalog = useGeneratorStore((s) => s.catalog);
  const selectedSlug = useGeneratorStore((s) => s.selectedSlug);
  const setSelectedSlug = useGeneratorStore((s) => s.setSelectedSlug);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (s) =>
        s.slug.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q),
    );
  }, [catalog, search]);

  const grouped = useMemo(() => {
    const map = new Map<ShortcodeCategory, ShortcodeSpec[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const spec of filtered) {
      map.get(spec.category)?.push(spec);
    }
    return map;
  }, [filtered]);

  return (
    <>
      <input
        className="tool-picker__search"
        type="search"
        placeholder="Search shortcodes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
      />
      <nav className="tool-picker__list" aria-label="Shortcode catalog">
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped.get(cat) ?? [];
          if (items.length === 0) return null;
          return (
            <div key={cat} className="tool-picker__group">
              <h3 className="tool-picker__group-title">{CATEGORY_LABELS[cat]}</h3>
              <ul className="tool-picker__items">
                {items.map((spec) => (
                  <li key={spec.slug}>
                    <button
                      type="button"
                      className={`tool-picker__item${selectedSlug === spec.slug ? " is-active" : ""}`}
                      aria-current={selectedSlug === spec.slug ? "true" : undefined}
                      onClick={() => setSelectedSlug(spec.slug)}
                    >
                      {spec.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="tool-picker__empty">No matches.</p>}
      </nav>
    </>
  );
}