/**
 * Client-side search — filters a build-time JSON index against the user's
 * typed query.
 *
 * One behavior only: take what the user types into the search box, do a
 * case-insensitive substring match against the title and summary of every
 * page in `/index.json` (emitted by Hugo's output formats — see
 * `layouts/_default/home.json`), and render up to 10 results into a
 * suggestions list. Input is debounced via `utils/debounce.debounce`.
 *
 * Phase 6 establishes the floor: case-insensitive substring matching across
 * title + summary. A future upgrade to inverted-index search (Lunr / Fuse /
 * MiniSearch) is a drop-in replacement behind this module boundary — see
 * `docs/ARCHITECTURE.md` §5.
 */

import { addClass, q, qAll, removeClass } from '../utils/dom';
import { debounce } from '../utils/debounce';

const DEBOUNCE_MS = 120;
const MAX_RESULTS = 10;

type IndexEntry = {
  title: string;
  summary?: string;
  url: string;
};

const fetchIndex = async (): Promise<IndexEntry[]> => {
  try {
    const response = await fetch('/index.json');
    if (!response.ok) return [];
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return [];
    return data.filter((e): e is IndexEntry => {
      if (typeof e !== 'object' || e === null) return false;
      const obj = e as Record<string, unknown>;
      return typeof obj['title'] === 'string' && typeof obj['url'] === 'string';
    });
  } catch {
    return [];
  }
};

const normalise = (value: string): string =>
  value.toLowerCase().normalize('NFKC').trim();

const scoreEntry = (entry: IndexEntry, needle: string): number => {
  const title = normalise(entry.title);
  const summary = normalise(entry.summary ?? '');
  let score = 0;
  if (title === needle) score += 100;
  if (title.startsWith(needle)) score += 50;
  if (title.includes(needle)) score += 20;
  if (summary.includes(needle)) score += 5;
  return score;
};

const buildResultsContainer = (box: HTMLElement): HTMLElement => {
  let list = box.querySelector<HTMLElement>('.search-box__suggestions');
  if (list) return list;
  list = document.createElement('div');
  list.className = 'search-box__suggestions';
  list.setAttribute('role', 'listbox');
  box.appendChild(list);
  return list;
};

const renderResults = (
  container: HTMLElement,
  results: IndexEntry[],
  onSelect: (entry: IndexEntry) => void,
): void => {
  container.innerHTML = '';
  if (results.length === 0) {
    container.hidden = true;
    return;
  }
  container.hidden = false;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < results.length; i += 1) {
    const entry = results[i];
    const item = document.createElement('a');
    item.className = 'search-box__suggestion';
    item.href = entry.url;
    item.setAttribute('role', 'option');
    item.setAttribute('id', `search-result-${i}`);
    item.textContent = entry.title;
    item.addEventListener('click', () => onSelect(entry));
    fragment.appendChild(item);
  }
  container.appendChild(fragment);
};

export const init = (): void => {
  const box = q<HTMLElement>('.search-box');
  if (!box) return;
  const input = q<HTMLInputElement>('.search-box__input', box);
  if (!input) return;

  const list = buildResultsContainer(box);
  let index: IndexEntry[] | null = null;
  let indexPromise: Promise<IndexEntry[]> | null = null;

  const ensureIndex = (): Promise<IndexEntry[]> => {
    if (index !== null) return Promise.resolve(index);
    if (indexPromise === null) {
      indexPromise = fetchIndex().then((entries) => {
        index = entries;
        return entries;
      });
    }
    return indexPromise;
  };

  const closeSuggestions = (): void => {
    list.hidden = true;
    removeClass(box, 'search-box--suggestions-open');
    input.setAttribute('aria-expanded', 'false');
  };

  const openSuggestions = (): void => {
    addClass(box, 'search-box--suggestions-open');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  const handleQuery = (rawQuery: string): void => {
    const needle = normalise(rawQuery);
    if (needle.length === 0) {
      closeSuggestions();
      return;
    }
    void ensureIndex().then((entries) => {
      const ranked = entries
        .map((entry) => ({ entry, score: scoreEntry(entry, needle) }))
        .filter((row) => row.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_RESULTS)
        .map((row) => row.entry);
      renderResults(list, ranked, (entry) => {
        window.location.href = entry.url;
      });
      if (ranked.length > 0) openSuggestions();
      else closeSuggestions();
    });
  };

  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', list.id || 'search-box-suggestions');
  list.id = list.id || 'search-box-suggestions';

  const debouncedQuery = debounce(() => handleQuery(input.value), DEBOUNCE_MS);

  input.addEventListener('input', debouncedQuery);
  input.addEventListener('focus', () => {
    if (input.value.trim().length > 0) openSuggestions();
  });

  document.addEventListener('click', (event) => {
    if (!box.contains(event.target as Node)) closeSuggestions();
  });

  qAll<HTMLAnchorElement>('.search-box__suggestion', list).forEach((anchor) => {
    anchor.addEventListener('click', () => closeSuggestions());
  });
};
