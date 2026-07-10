// Stub — implementation lands in Phase 6. See .cursor/rules/30-scripts.mdc.
// Pure, dependency-free DOM helpers only — no behavior here.
export const q = <T extends Element = Element>(sel: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(sel);

export const qa = <T extends Element = Element>(sel: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(sel));
