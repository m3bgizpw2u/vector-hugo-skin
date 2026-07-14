/**
 * Wikipedia-style lightbox (Multimedia Viewer / MMV) for the Hugo theme.
 *
 * Clicks on any `<figure data-lightbox>` open a full-screen overlay showing
 * the image at full resolution. Figures sharing the same `data-lightbox-group`
 * value form a navigable carousel; ungrouped figures operate in isolation.
 *
 * Keyboard: Escape closes, ArrowLeft/Right navigates (RTL-aware),
 * Home/End jump to first/last. Tab cycles through interactive elements only.
 *
 * Accessibility: role="dialog" + aria-modal, focus-trapped while open,
 * focus returned to the trigger figure on close.
 */

import { addClass, q, qAll, removeClass, toggleClass } from '../utils/dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LightboxImage {
  element: HTMLElement; // the <figure>
  img: HTMLImageElement; // the <img> inside
  src: string; // current src
  caption: string | null; // textContent of figcaption
  group: string; // group key or ""
}

interface LightboxGroup {
  key: string; // group key or ""
  images: LightboxImage[];
}

// ─── State ───────────────────────────────────────────────────────────────────

let overlay: HTMLElement | null = null;
let backdrop: HTMLElement | null = null;
let currentGroup: LightboxGroup | null = null;
let currentIndex = 0;
let triggerElement: HTMLElement | null = null;

// lazily-initialised DOM refs (populated by buildOverlay)
let closeBtn: HTMLButtonElement;
let prevBtn: HTMLButtonElement;
let nextBtn: HTMLButtonElement;
let imgEl: HTMLImageElement;
let captionEl: HTMLElement;
let counterEl: HTMLElement;

// ─── Init ────────────────────────────────────────────────────────────────────

export const init = (): void => {
  const figures = qAll<HTMLElement>('[data-lightbox]');
  if (figures.length === 0) return;

  buildOverlay();
  const groups = collectGroups(figures);
  attachClickHandlers(groups);
  document.addEventListener('keydown', handleKeydown);
};

// ─── Group collection ────────────────────────────────────────────────────────

const collectGroups = (figures: HTMLElement[]): Map<string, LightboxGroup> => {
  const groups = new Map<string, LightboxGroup>();

  for (const figure of figures) {
    const key = figure.getAttribute('data-lightbox-group') ?? '';
    const img = q<HTMLImageElement>('img', figure);

    const image: LightboxImage = {
      element: figure,
      img: img!,
      src: img?.src ?? '',
      caption: q<HTMLElement>('figcaption', figure)?.textContent?.trim() ?? null,
      group: key,
    };

    if (!groups.has(key)) {
      groups.set(key, { key, images: [] });
    }
    groups.get(key)!.images.push(image);
  }

  return groups;
};

const attachClickHandlers = (groups: Map<string, LightboxGroup>): void => {
  for (const group of groups.values()) {
    for (const image of group.images) {
      image.element.style.cursor = 'zoom-in';
      image.element.addEventListener('click', () => {
        const index = group.images.indexOf(image);
        openLightbox(group, index, image.element);
      });
    }
  }
};

// ─── Overlay construction (once) ────────────────────────────────────────────

const buildOverlay = (): void => {
  overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.id = 'lightbox-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');

  backdrop = document.createElement('div');
  backdrop.className = 'lightbox-backdrop';

  const container = document.createElement('div');
  container.className = 'lightbox-container';

  closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-btn lightbox-btn--close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = 'X';

  prevBtn = document.createElement('button');
  prevBtn.className = 'lightbox-btn lightbox-btn--prev';
  prevBtn.setAttribute('aria-label', 'Previous image');
  prevBtn.textContent = '<';

  nextBtn = document.createElement('button');
  nextBtn.className = 'lightbox-btn lightbox-btn--next';
  nextBtn.setAttribute('aria-label', 'Next image');
  nextBtn.textContent = '>';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'lightbox-image-wrapper';

  imgEl = document.createElement('img');
  imgEl.className = 'lightbox-img';
  imgEl.src = '';
  imgEl.alt = '';

  const captionArea = document.createElement('div');
  captionArea.className = 'lightbox-caption-area';

  captionEl = document.createElement('p');
  captionEl.className = 'lightbox-caption';

  counterEl = document.createElement('p');
  counterEl.className = 'lightbox-counter';

  captionArea.appendChild(captionEl);
  captionArea.appendChild(counterEl);
  imageWrapper.appendChild(imgEl);
  container.appendChild(backdrop);
  container.appendChild(closeBtn);
  container.appendChild(prevBtn);
  container.appendChild(nextBtn);
  container.appendChild(imageWrapper);
  container.appendChild(captionArea);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));
  backdrop.addEventListener('click', closeLightbox);
  overlay!.addEventListener('keydown', handleOverlayKeydown);
};

// ─── Open / close ─────────────────────────────────────────────────────────────

const openLightbox = (
  group: LightboxGroup,
  index: number,
  trigger: HTMLElement,
): void => {
  currentGroup = group;
  currentIndex = index;
  triggerElement = trigger;
  showImage(index);
  addClass(overlay!, 'lightbox-overlay--visible');
  overlay!.removeAttribute('aria-hidden');
  closeBtn.focus();
};

const closeLightbox = (): void => {
  if (!overlay) return;
  removeClass(overlay, 'lightbox-overlay--visible');
  overlay.setAttribute('aria-hidden', 'true');
  (triggerElement as HTMLElement | null)?.focus();
  currentGroup = null;
  currentIndex = 0;
  triggerElement = null;
};

// ─── Image display ───────────────────────────────────────────────────────────

const showImage = (index: number): void => {
  const img = currentGroup!.images[index];
  imgEl.src = img.src;
  imgEl.alt = img.img.alt;
  captionEl.textContent = img.caption ?? '';
  counterEl.textContent = `${index + 1} / ${currentGroup!.images.length}`;
  updateNavButtons(index, currentGroup!.images.length);
  preloadAdjacent(index);
};

const updateNavButtons = (index: number, total: number): void => {
  prevBtn.disabled = total <= 1;
  nextBtn.disabled = total <= 1;
  toggleClass(prevBtn, 'lightbox-btn--hidden', index <= 0);
  toggleClass(nextBtn, 'lightbox-btn--hidden', index >= total - 1);
};

// ─── Navigation ──────────────────────────────────────────────────────────────

const navigate = (direction: 1 | -1): void => {
  if (!currentGroup) return;
  const len = currentGroup.images.length;
  const isRtl =
    document.dir === 'rtl' ||
    document.documentElement.dir === 'rtl';

  // In RTL, left arrow means "next" and right arrow means "prev"
  const effectiveDir = isRtl ? -direction : direction;
  const nextIndex = (currentIndex + effectiveDir + len) % len;
  currentIndex = nextIndex;
  showImage(nextIndex);
};

// ─── Preload ─────────────────────────────────────────────────────────────────

const preloadAdjacent = (index: number): void => {
  if (!currentGroup) return;
  const len = currentGroup.images.length;
  const prevIndex = (index - 1 + len) % len;
  const nextIndex = (index + 1) % len;

  const preload = (i: number): void => {
    const src = currentGroup!.images[i].src;
    const img = new Image();
    img.src = src;
  };

  if (prevIndex !== index) preload(prevIndex);
  if (nextIndex !== index) preload(nextIndex);
};

// ─── Keyboard handling ───────────────────────────────────────────────────────

const handleKeydown = (event: KeyboardEvent): void => {
  if (!overlay || overlay.getAttribute('aria-hidden') === 'true') return;

  switch (event.key) {
    case 'Escape':
      event.preventDefault();
      closeLightbox();
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Home':
    case 'End':
      event.preventDefault();
      break;
  }
};

const handleOverlayKeydown = (event: KeyboardEvent): void => {
  if (!overlay || overlay.getAttribute('aria-hidden') === 'true') return;

  const isRtl =
    document.dir === 'rtl' ||
    document.documentElement.dir === 'rtl';

  switch (event.key) {
    case 'Escape':
      event.preventDefault();
      closeLightbox();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      navigate(isRtl ? 1 : -1);
      break;
    case 'ArrowRight':
      event.preventDefault();
      navigate(isRtl ? -1 : 1);
      break;
    case 'Home':
      event.preventDefault();
      currentIndex = 0;
      showImage(0);
      break;
    case 'End':
      event.preventDefault();
      currentIndex = (currentGroup?.images.length ?? 1) - 1;
      showImage(currentIndex);
      break;
    case 'Tab': {
      event.preventDefault();
      const focusable = qAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        overlay!,
      ).filter(
        (el) =>
          !(el as HTMLButtonElement).disabled && el.offsetParent !== null,
      );

      if (focusable.length === 0) break;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
        } else {
          const idx = focusable.indexOf(document.activeElement as HTMLElement);
          focusable[idx - 1]?.focus();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
        } else {
          const idx = focusable.indexOf(document.activeElement as HTMLElement);
          focusable[idx + 1]?.focus();
        }
      }
      break;
    }
  }
};
