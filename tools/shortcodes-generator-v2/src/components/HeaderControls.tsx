import { useGeneratorStore } from "../state/useGeneratorStore";
import { ThemeToggle } from "./ThemeToggle";

export function HeaderControls(): JSX.Element {
  const format = useGeneratorStore((s) => s.format);
  const setFormat = useGeneratorStore((s) => s.setFormat);

  return (
    <div className="tool-header__controls">
      <label className="tool-control">
        <span className="tool-control__label">Format</span>
        <select
          className="tool-control__input"
          value={format}
          onChange={(e) => setFormat(e.target.value as "vertical" | "compact")}
        >
          <option value="vertical">Vertical</option>
          <option value="compact">Compact</option>
        </select>
      </label>
      <ThemeToggle />
    </div>
  );
}