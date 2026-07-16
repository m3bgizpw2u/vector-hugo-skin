import { useEffect } from "react";
import { Picker } from "./components/Picker";
import { Form } from "./components/Form";
import { Preview } from "./components/Preview";
import { HeaderControls } from "./components/HeaderControls";
import { useGeneratorStore } from "./state/useGeneratorStore";

export function App(): JSX.Element {
  const theme = useGeneratorStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <header className="tool-header">
        <h1 className="tool-title">Shortcodes generator v2</h1>
        <HeaderControls />
      </header>
      <main className="tool-shell">
        <aside className="tool-pane tool-pane--picker" aria-label="Picker">
          <Picker />
        </aside>
        <section className="tool-pane tool-pane--form" aria-label="Form">
          <Form />
        </section>
        <section className="tool-pane tool-pane--preview" aria-label="Preview">
          <Preview />
        </section>
      </main>
    </>
  );
}