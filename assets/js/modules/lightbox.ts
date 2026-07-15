/**
 * Original work — Wikipedia-style lightbox (Multimedia Viewer equivalent).
 * GPL-2.0-or-later.
 *
 * Rewrite per the fourth-plan phase 0-3 / 2-4 spec. Clicks on any
 * `<figure data-lightbox>` (or wrapper carrying `data-lightbox` around
 * an `<img>`) open a full-screen overlay with metadata panel.
 *
 * Triggers:
 *   - `click` on a figure with `data-lightbox`
 *   - `click` on an `<img>` inside a data-lightbox figure (event bubbles)
 *   - `Enter` / `Space` keypress on the focused figure
 *
 * Group carousel: figures sharing the same `data-lightbox-group` value
 * form a navigable carousel. Ungrouped figures operate in isolation
 * (prev/next disabled, counter shows "1 / 1").
 *
 * Keyboard: Escape closes, ArrowLeft/Right navigates (RTL-aware),
 * Home/End jump to first/last, Tab cycles focus within the overlay.
 *
 * Accessibility: `role="dialog"` + `aria-modal`, focus-trapped while
 * open, focus returned to trigger on close, all buttons ARIA-labelled.
 *
 * Metadata panel: caption / filename / dimensions / license / counter,
 * each independently hideable when empty.
 */
import { addClass, q, qAll, removeClass, toggleClass } from '../utils/dom';

interface LightboxImage {
  element: HTMLElement;
  img: HTMLImageElement;
  src: string;
  caption: string | null;
  filename: string | null;
  dimensions: { width: number; height: number } | null;
  license: string | null;
  group: string;
}

interface LightboxGroup {
  key: string;
  images: LightboxImage[];
}

let overlay: HTMLElement | null = null;
let currentGroup: LightboxGroup | null = null;
let currentIndex = 0;
let triggerElement: HTMLElement | null = null;

let closeBtn: HTMLButtonElement;
let prevBtn: HTMLButtonElement;
let nextBtn: HTMLButtonElement;
let imgEl: HTMLImageElement;
let captionEl: HTMLElement;
let filenameEl: HTMLElement;
let dimensionsEl: HTMLElement;
let licenseEl: HTMLElement;
let counterEl: HTMLElement;

let initialized = false;

export const init = (): void => {
  if (initialized) return;
  initialized = true;

  const triggers = qAll<HTMLElement>('[data-lightbox]');
  if (triggers.length === 0) return;

  buildOverlay();
  const groups = collectGroups(triggers);
  attachClickHandlers(groups);
  document.addEventListener('keydown', handleKeydown);
};

const collectGroups = (
  triggers: HTMLElement[],
): Map<string, LightboxGroup> => {
  const groups = new Map<string, LightboxGroup>();

  for (const trigger of triggers) {
    const key = trigger.getAttribute('data-lightbox-group') ?? '';
    const img = q<HTMLImageElement>('img', trigger);

    if (!img) continue;

    const image: LightboxImage = {
      element: trigger,
      img,
      src: img.currentSrc || img.src,
      caption:
        q<HTMLElement>('figcaption', trigger)?.textContent?.trim() ??
        trigger.getAttribute('data-lightbox-caption') ??
        null,
      filename:
        trigger.getAttribute('data-lightbox-filename') ?? basename(img.src),
      dimensions:
        img.naturalWidth > 0
          ? { width: img.naturalWidth, height: img.naturalHeight }
          : null,
      license: trigger.getAttribute('data-lightbox-license') ?? null,
      group: key,
    };

    if (!groups.has(key)) {
      groups.set(key, { key, images: [] });
    }
    groups.get(key)!.images.push(image);
  }

  return groups;
};

const basename = (src: string): string => {
  if (!src) return '';
  const parts = src.split('/');
  return parts[parts.length - 1] || src;
};

const attachClickHandlers = (groups: Map<string, LightboxGroup>): void => {
  for (const group of groups.values()) {
    for (const image of group.images) {
      image.element.style.cursor = 'zoom-in';
      image.element.addEventListener('click', () => {
        const index = group.images.indexOf(image);
        openLightbox(group, index, image.element);
      });
      image.element.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const index = group.images.indexOf(image);
          openLightbox(group, index, image.element);
        }
      });
    }
  }
};

const buildOverlay = (): void => {
  overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.id = 'lightbox-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');

  const backdrop = document.createElement('div');
  backdrop.className = 'lightbox-backdrop';

  const container = document.createElement('div');
  container.className = 'lightbox-container';

  closeBtn = createButton('lightbox-btn lightbox-btn--close', 'Close', '\u00d7');
  prevBtn = createButton('lightbox-btn lightbox-btn--prev', 'Previous image', '\u2039');
  nextBtn = createButton('lightbox-btn lightbox-btn--next', 'Next image', '\u203a');

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'lightbox-image-wrapper';

  imgEl = document.createElement('img');
  imgEl.className = 'lightbox-img';
  imgEl.alt = '';

  imageWrapper.appendChild(imgEl);

  const metadata = document.createElement('div');
  metadata.className = 'lightbox-metadata';

  captionEl = document.createElement('p');
  captionEl.className = 'lightbox-caption';

  filenameEl = document.createElement('p');
  filenameEl.className = 'lightbox-filename';

  dimensionsEl = document.createElement('p');
  dimensionsEl.className = 'lightbox-dimensions';

  licenseEl = document.createElement('p');
  licenseEl.className = 'lightbox-license';

  counterEl = document.createElement('p');
  counterEl.className = 'lightbox-counter';

  metadata.appendChild(captionEl);
  metadata.appendChild(filenameEl);
  metadata.appendChild(dimensionsEl);
  metadata.appendChild(licenseEl);
  metadata.appendChild(counterEl);

  container.appendChild(closeBtn);
  container.appendChild(prevBtn);
  container.appendChild(nextBtn);
  container.appendChild(imageWrapper);
  container.appendChild(metadata);

  overlay.appendChild(backdrop);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));
  backdrop.addEventListener('click', closeLightbox);
  overlay.addEventListener('keydown', handleOverlayKeydown);
};

const createButton = (
  className: string,
  ariaLabel: string,
  text: string,
): HTMLButtonElement => {
  const btn = document.createElement('button');
  btn.className = className;
  btn.setAttribute('aria-label', ariaLabel);
  btn.setAttribute('type', 'button');
  btn.textContent = text;
  return btn;
};

const openLightbox = (
  group: LightboxGroup,
  index: number,
  trigger: HTMLElement,
): void => {
  if (!overlay) return;
  currentGroup = group;
  currentIndex = index;
  triggerElement = trigger;
  showImage(index);
  addClass(overlay, 'lightbox-overlay--visible');
  overlay.removeAttribute('aria-hidden');
  closeBtn.focus();
};

const closeLightbox = (): void => {
  if (!overlay) return;
  removeClass(overlay, 'lightbox-overlay--visible');
  overlay.setAttribute('aria-hidden', 'true');
  if (triggerElement) triggerElement.focus();
  currentGroup = null;
  currentIndex = 0;
  triggerElement = null;
};

const isRtl = (): boolean =>
  document.dir === 'rtl' || document.documentElement.dir === 'rtl';

const showImage = (index: number): void => {
  if (!currentGroup) return;
  const image = currentGroup.images[index];
  imgEl.src = image.src;
  imgEl.alt = image.img.alt;

  captionEl.textContent = image.caption ?? '';
  filenameEl.textContent = image.filename ?? '';
  dimensionsEl.textContent = image.dimensions
    ? `${image.dimensions.width} \u00d7 ${image.dimensions.height} pixels`
    : '';
  licenseEl.textContent = image.license ?? '';
  counterEl.textContent = `${index + 1} / ${currentGroup.images.length}`;

  toggleClass(captionEl, 'lightbox-metadata--hidden', !image.caption);
  toggleClass(filenameEl, 'lightbox-metadata--hidden', !image.filename);
  toggleClass(dimensionsEl, 'lightbox-metadata--hidden', !image.dimensions);
  toggleClass(licenseEl, 'lightbox-metadata--hidden', !image.license);

  updateNavButtons(index, currentGroup.images.length);
  preloadAdjacent(index);
};

const updateNavButtons = (_index: number, total: number): void => {
  prevBtn.disabled = total <= 1;
  nextBtn.disabled = total <= 1;
  toggleClass(prevBtn, 'lightbox-btn--hidden', total <= 1);
  toggleClass(nextBtn, 'lightbox-btn--hidden', total <= 1);
};

const navigate = (direction: 1 | -1): void => {
  if (!currentGroup) return;
  const len = currentGroup.images.length;
  const effective = isRtl() ? -direction : direction;
  const nextIndex = (currentIndex + effective + len) % len;
  currentIndex = nextIndex;
  showImage(nextIndex);
};

const preloadAdjacent = (index: number): void => {
  if (!currentGroup) return;
  const len = currentGroup.images.length;
  const prevIndex = (index - 1 + len) % len;
  const nextIndex = (index + 1) % len;

  if (prevIndex !== index) {
    const img = new Image();
    img.src = currentGroup.images[prevIndex].src;
  }
  if (nextIndex !== index) {
    const img = new Image();
    img.src = currentGroup.images[nextIndex].src;
  }
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (!overlay || overlay.getAttribute('aria-hidden') !== 'false') return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeLightbox();
  }
};

const handleOverlayKeydown = (event: KeyboardEvent): void => {
  if (!overlay || overlay.getAttribute('aria-hidden') !== 'false') return;

  switch (event.key) {
    case 'Escape':
      event.preventDefault();
      closeLightbox();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      navigate(isRtl() ? 1 : -1);
      break;
    case 'ArrowRight':
      event.preventDefault();
      navigate(isRtl() ? -1 : 1);
      break;
    case 'Home':
      event.preventDefault();
      if (currentGroup) {
        currentIndex = 0;
        showImage(0);
      }
      break;
    case 'End':
      event.preventDefault();
      if (currentGroup) {
        currentIndex = currentGroup.images.length - 1;
        showImage(currentIndex);
      }
      break;
    case 'Tab':
      trapFocus(event);
      break;
  }
};

const trapFocus = (event: KeyboardEvent): void => {
  if (!overlay) return;
  const focusable = qAll<HTMLElement>(
    'button:not([disabled]):not([tabindex="-1"]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
    overlay,
  ).filter((el) => el.offsetParent !== null);

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};
