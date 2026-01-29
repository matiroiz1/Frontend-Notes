import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const THEMES = ["default", "cream", "dark"] as const;
export type Theme = typeof THEMES[number];

export default function ThemeSwitcher() {
  // 1. Inicializamos el estado leyendo de localStorage (o default si no existe)
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("app-theme");
      // Validamos que lo que recuperamos sea un tema válido
      if (saved && THEMES.includes(saved as Theme)) {
        return saved as Theme;
      }
      return "default";
    } catch {
      return "default";
    }
  });

  // 2. Efecto: Cada vez que cambia el tema, actualizamos el HTML y localStorage
  useEffect(() => {
    try {
      if (theme === "default") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
      localStorage.setItem("app-theme", theme);
    } catch (err) {
      console.error("Error applying theme:", err);
    }
  }, [theme]);

  return (
    <ButtonGroup aria-label="Theme selector" size="sm">
      <Button
        variant={theme === "default" ? "primary" : "outline-secondary"}
        onClick={() => setTheme("default")}
        title="Light / Default"
      >
        <i className="bi bi-sun-fill" />
      </Button>
      
      <Button
        variant={theme === "cream" ? "primary" : "outline-secondary"}
        onClick={() => setTheme("cream")}
        title="Warm / Cream"
      >
        <i className="bi bi-palette-fill" />
      </Button>
      
      <Button
        variant={theme === "dark" ? "primary" : "outline-secondary"}
        onClick={() => setTheme("dark")}
        title="Dark Mode"
      >
        <i className="bi bi-moon-fill" />
      </Button>
    </ButtonGroup>
  );
}