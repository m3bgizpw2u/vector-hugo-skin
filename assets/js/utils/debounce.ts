/**
 * Debounce and throttle helpers.
 *
 * Both return a wrapper that preserves `this` and forwards the latest arguments at
 * call-time. Used by `search.ts` (debounce input) and `sticky-header.ts` (throttle
 * scroll). See `.cursor/rules/30-scripts.mdc`.
 */

type AnyFn = (...args: never[]) => unknown;

export const debounce = <Fn extends AnyFn>(
  fn: Fn,
  waitMs: number,
): Fn => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return ((...args: never[]) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, waitMs);
  }) as Fn;
};

export const throttle = <Fn extends AnyFn>(
  fn: Fn,
  waitMs: number,
): Fn => {
  let lastInvocation = 0;
  let trailingTimer: ReturnType<typeof setTimeout> | undefined;
  return ((...args: never[]) => {
    const now = Date.now();
    const elapsed = now - lastInvocation;
    if (elapsed >= waitMs) {
      lastInvocation = now;
      fn(...args);
    } else if (trailingTimer === undefined) {
      trailingTimer = setTimeout(() => {
        lastInvocation = Date.now();
        trailingTimer = undefined;
        fn(...args);
      }, waitMs - elapsed);
    }
  }) as Fn;
};
