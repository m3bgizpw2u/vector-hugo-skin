// Generator store with localStorage persistence (Zustand 4.x).
// Phase 2 components read from and write to this store.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  ShortcodeSpec,
  FieldValue,
  CustomRow,
  CustomParam,
  GeneratorState,
} from '../data/types';
import { catalog as initialCatalog } from '../data';

interface StoreState {
  catalog: ShortcodeSpec[];
  selectedSlug: string | null;
  format: 'vertical' | 'compact';
  theme: 'light' | 'dark';
  activeTab: 'source' | 'rendered';
  values: Record<string, Record<string, FieldValue>>;
  customRows: Record<string, CustomRow[]>;
  customParams: Record<string, CustomParam[]>;

  setCatalog: (catalog: ShortcodeSpec[]) => void;
  setSelectedSlug: (slug: string | null) => void;
  setFormat: (format: 'vertical' | 'compact') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveTab: (tab: 'source' | 'rendered') => void;
  setValue: (slug: string, key: string, value: FieldValue) => void;
  resetValues: (slug: string) => void;

  addCustomRow: (slug: string) => void;
  removeCustomRow: (slug: string, id: string) => void;
  updateCustomRow: (slug: string, id: string, patch: Partial<CustomRow>) => void;
  reorderCustomRows: (slug: string, fromIndex: number, toIndex: number) => void;

  addCustomParam: (slug: string) => void;
  removeCustomParam: (slug: string, id: string) => void;
  updateCustomParam: (slug: string, id: string, patch: Partial<CustomParam>) => void;
}

const customState = {
  values: {} as Record<string, Record<string, FieldValue>>,
  customRows: {} as Record<string, CustomRow[]>,
  customParams: {} as Record<string, CustomParam[]>,
};

export const useGeneratorStore = create<StoreState>()(
  persist(
    (set) => ({
      catalog: initialCatalog,
      selectedSlug: null,
      format: 'vertical',
      theme: 'light',
      activeTab: 'source',
      ...customState,

      setCatalog: (catalog) => set({ catalog }),
      setSelectedSlug: (slug) => set({ selectedSlug: slug }),
      setFormat: (format) => {
        set({ format });
        // Format affects generated output; no DOM side effect.
      },
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      setActiveTab: (tab) => set({ activeTab: tab }),
      setValue: (slug, key, value) =>
        set((s) => ({
          values: { ...s.values, [slug]: { ...(s.values[slug] ?? {}), [key]: value } },
        })),
      resetValues: (slug) =>
        set((s) => {
          const next = { ...s.values };
          delete next[slug];
          return { values: next };
        }),

        addCustomRow: (slug) =>
        set((s) => {
          const existing = s.customRows[slug] ?? [];
          const id = `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          return {
            customRows: {
              ...s.customRows,
              [slug]: [...existing, { id, label: "", kind: "markdown", value: "" }],
            },
          };
        }),
      removeCustomRow: (slug, id) =>
        set((s) => ({
          customRows: {
            ...s.customRows,
            [slug]: (s.customRows[slug] ?? []).filter((r) => r.id !== id),
          },
        })),
      updateCustomRow: (slug, id, patch) =>
        set((s) => ({
          customRows: {
            ...s.customRows,
            [slug]: (s.customRows[slug] ?? []).map((r) => (r.id === id ? { ...r, ...patch } : r)),
          },
        })),
      reorderCustomRows: (slug, fromIndex, toIndex) =>
        set((s) => {
          const rows = [...(s.customRows[slug] ?? [])];
          if (fromIndex < 0 || fromIndex >= rows.length) return s;
          if (toIndex < 0 || toIndex >= rows.length) return s;
          const [moved] = rows.splice(fromIndex, 1);
          rows.splice(toIndex, 0, moved);
          return { customRows: { ...s.customRows, [slug]: rows } };
        }),

      addCustomParam: (slug) =>
        set((s) => {
          const existing = s.customParams[slug] ?? [];
          const id = `param-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          return {
            customParams: { ...s.customParams, [slug]: [...existing, { id, key: '', value: '' }] },
          };
        }),
      removeCustomParam: (slug, id) =>
        set((s) => ({
          customParams: {
            ...s.customParams,
            [slug]: (s.customParams[slug] ?? []).filter((p) => p.id !== id),
          },
        })),
      updateCustomParam: (slug, id, patch) =>
        set((s) => ({
          customParams: {
            ...s.customParams,
            [slug]: (s.customParams[slug] ?? []).map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),
    }),
    {
      name: 'vhskin:scg:v2:state',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedSlug: state.selectedSlug,
        format: state.format,
        theme: state.theme,
        activeTab: state.activeTab,
        values: state.values,
        customRows: state.customRows,
        customParams: state.customParams,
      }),
      migrate: (persisted, fromVersion) => {
        const state = (persisted ?? {}) as Partial<GeneratorState>;
        if (fromVersion < 2) {
          // Backfill `kind: "markdown"` on rows persisted before the field existed.
          const customRows = state.customRows ?? {};
          for (const slug of Object.keys(customRows)) {
            customRows[slug] = (customRows[slug] ?? []).map((r) => ({
              ...r,
              kind: r.kind ?? "markdown",
            }));
          }
        }
        return state as GeneratorState;
      },
    },
  ),
);
