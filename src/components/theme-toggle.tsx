"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex rounded-lg border overflow-hidden w-fit">
      <Button
        type="button"
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        className="rounded-none"
        onClick={() => setTheme("light")}
      >
        Lys
      </Button>
      <Button
        type="button"
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        className="rounded-none"
        onClick={() => setTheme("dark")}
      >
        Mørk
      </Button>
      <Button
        type="button"
        variant={theme === "system" ? "default" : "ghost"}
        size="sm"
        className="rounded-none"
        onClick={() => setTheme("system")}
      >
        System
      </Button>
    </div>
  );
}