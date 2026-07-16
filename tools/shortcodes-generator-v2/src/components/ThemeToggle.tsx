import { useGeneratorStore } from "../state/useGeneratorStore";

export function ThemeToggle(): JSX.Element {
  const theme = useGeneratorStore((s) => s.theme);
  const setTheme = useGeneratorStore((s) => s.setTheme);

  return (
    <label className="tool-control">
      <span className="tool-control__label">Theme</span>
      <select
        className="tool-control__input"
        value={theme}
        onChange={(e) => setTheme(e.target.value as "light" | "dark")}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}