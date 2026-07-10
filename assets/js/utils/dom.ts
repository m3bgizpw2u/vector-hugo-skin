/**
 * Minimal, dependency-free DOM helpers — no behavior logic, no event listeners.
 * Modules are expected to use addEventListener directly when they need listeners;
 * this util exists only to keep querySelector / classList boilerplate out of every
 * module. See `.cursor/rules/30-scripts.mdc`.
 */

export const q = <T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): T | null => root.querySelector<T>(selector);

export const qAll = <T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): T[] => Array.from(root.querySelectorAll<T>(selector));

export const addClass = (element: Element, ...classes: string[]): void => {
  for (const cls of classes) element.classList.add(cls);
};

export const removeClass = (element: Element, ...classes: string[]): void => {
  for (const cls of classes) element.classList.remove(cls);
};

export const toggleClass = (
  element: Element,
  className: string,
  force?: boolean,
): boolean => element.classList.toggle(className, force);
