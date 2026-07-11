/**
 * Derived from mediawiki-skins-Vector @ 7c224883 (REL1_42, 2025-06-12),
 * file: resources/skins.vector.js/tableOfContents.js
 * Original (c) Wikimedia Foundation and contributors, GPL-2.0-or-later.
 * This file: GPL-2.0-or-later.
 * Header per docs/PORT-MAP-CONVENTIONS.md §A.
 */
/**
 * Table of Contents — scroll-spy + collapsible sub-trees.
 *
 * One behavior only: as the reader scrolls the article, the matching ToC entry
 * gets a visual highlight via the `.toc__item--active` class (which
 * `assets/css/components/toc.scss` styles as the left-border accent).
 *
 * Approach: build a map of `heading id → ToC link`, observe the headings with a
 * single IntersectionObserver, then toggle the active class. Heading ids come
 * from Hugo's auto-generated `id` attributes on `<h2>` etc; the ToC links are
 * anchors emitted by `.TableOfContents`.
 *
 * Collapsible sub-trees are delegated to native `<details>`/`<summary>` if the
 * ToC uses that pattern; nothing extra to do here.
 */

import { addClass, q, qAll, removeClass } from '../utils/dom';

const ACTIVE_CLASS = 'toc__item--active';
const HEADING_SELECTOR = 'article h2[id], article h3[id], article h4[id]';
const TOC_LINK_SELECTOR = '.toc a[href^="#"]';
const TOC_ITEM_SELECTOR = '.toc__item, li:has(> .toc a[href^="#"])';

const headingToLinkKey = (heading: HTMLElement): string => {
  const link = q<HTMLAnchorElement>(`a[href="#${heading.id}"]`);
  return link ? `link:${link.href}` : `id:${heading.id}`;
};

const findTocItem = (link: HTMLAnchorElement): HTMLElement | null => {
  let parent = link.parentElement;
  while (parent) {
    if (parent.matches(TOC_ITEM_SELECTOR)) return parent as HTMLElement;
    parent = parent.parentElement;
  }
  return null;
};

export const init = (): void => {
  const headings = qAll<HTMLElement>(HEADING_SELECTOR);
  const links = qAll<HTMLAnchorElement>(TOC_LINK_SELECTOR);
  if (headings.length === 0 || links.length === 0) return;

  const itemByLink = new Map<HTMLAnchorElement, HTMLElement>();
  for (const link of links) {
    const item = findTocItem(link);
    if (item) itemByLink.set(link, item);
  }

  const setActive = (link: HTMLAnchorElement | null): void => {
    for (const item of itemByLink.values()) removeClass(item, ACTIVE_CLASS);
    if (!link) return;
    const item = itemByLink.get(link);
    if (item) addClass(item, ACTIVE_CLASS);
  };

  const linkByHeadingId = new Map<string, HTMLAnchorElement>();
  for (const link of links) {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) continue;
    linkByHeadingId.set(href.slice(1), link);
  }

  const visibilityByLink = new Map<string, number>();

  const pickMostVisible = (): void => {
    let bestLink: HTMLAnchorElement | null = null;
    let bestRatio = 0;
    for (const [link, ratio] of visibilityByLink) {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestLink = linkByHeadingId.get(link) ?? null;
      }
    }
    setActive(bestLink ?? linkByHeadingId.get(headings[0].id) ?? null);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const heading = entry.target as HTMLElement;
        if (!heading.id) continue;
        const link = linkByHeadingId.get(heading.id);
        if (!link) continue;
        const key = headingToLinkKey(heading).replace('link:', '').replace('id:', '');
        if (entry.isIntersecting) visibilityByLink.set(key, entry.intersectionRatio);
        else visibilityByLink.delete(key);
      }
      pickMostVisible();
    },
    {
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    },
  );

  for (const heading of headings) observer.observe(heading);
};
