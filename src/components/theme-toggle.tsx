"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant={theme === "light" ? "default" : "outline"}
        size="sm"
        className="gap-1.5"
        onClick={() => setTheme("light")}
      >
        <Sun size={14} />
        Lys
      </Button>
      <Button
        type="button"
        variant={theme === "dark" ? "default" : "outline"}
        size="sm"
        className="gap-1.5"
        onClick={() => setTheme("dark")}
      >
        <Moon size={14} />
        Mørk
      </Button>
      <Button
        type="button"
        variant={theme === "system" ? "default" : "outline"}
        size="sm"
        className="gap-1.5"
        onClick={() => setTheme("system")}
      >
        <Monitor size={14} />
        System
      </Button>
    </div>
  );
}