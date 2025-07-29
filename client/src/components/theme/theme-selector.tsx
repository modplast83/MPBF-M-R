import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeOption {
  id: string;
  name: string;
  primary: string;
  variant: "professional" | "tint" | "vibrant";
  appearance: "light" | "dark";
  radius: number;
  preview: {
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    border: string;
  };
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "default-blue",
    name: "Professional Blue",
    primary: "#2563eb",
    variant: "professional",
    appearance: "light",
    radius: 0.5,
    preview: {
      background: "#ffffff",
      foreground: "#0f172a",
      muted: "#f1f5f9",
      accent: "#e0f2fe",
      border: "#e2e8f0",
    },
  },
  {
    id: "emerald-fresh",
    name: "Emerald Fresh",
    primary: "#10b981",
    variant: "tint",
    appearance: "light",
    radius: 0.75,
    preview: {
      background: "#ffffff",
      foreground: "#064e3b",
      muted: "#f0fdf4",
      accent: "#d1fae5",
      border: "#d1d5db",
    },
  },
  {
    id: "purple-modern",
    name: "Purple Modern",
    primary: "#8b5cf6",
    variant: "vibrant",
    appearance: "light",
    radius: 1,
    preview: {
      background: "#ffffff",
      foreground: "#1e1b4b",
      muted: "#faf5ff",
      accent: "#e9d5ff",
      border: "#d1d5db",
    },
  },
  {
    id: "orange-energy",
    name: "Orange Energy",
    primary: "#ea580c",
    variant: "vibrant",
    appearance: "light",
    radius: 0.5,
    preview: {
      background: "#ffffff",
      foreground: "#9a3412",
      muted: "#fff7ed",
      accent: "#fed7aa",
      border: "#d1d5db",
    },
  },
  {
    id: "dark-slate",
    name: "Dark Slate",
    primary: "#0ea5e9",
    variant: "professional",
    appearance: "dark",
    radius: 0.5,
    preview: {
      background: "#0f172a",
      foreground: "#f8fafc",
      muted: "#1e293b",
      accent: "#0f172a",
      border: "#334155",
    },
  },
  {
    id: "dark-emerald",
    name: "Dark Emerald",
    primary: "#10b981",
    variant: "tint",
    appearance: "dark",
    radius: 0.75,
    preview: {
      background: "#064e3b",
      foreground: "#ecfdf5",
      muted: "#065f46",
      accent: "#064e3b",
      border: "#059669",
    },
  },
];

interface ThemeSelectorProps {
  currentTheme?: string;
  onThemeChange?: (theme: ThemeOption) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || "default-blue");

  const handleThemeSelect = (theme: ThemeOption) => {
    setSelectedTheme(theme.id);
    onThemeChange?.(theme);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Selector
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEME_OPTIONS.map((theme) => (
            <div
              key={theme.id}
              className={cn(
                "relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105",
                selectedTheme === theme.id
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => handleThemeSelect(theme)}
            >
              {/* Theme Preview */}
              <div
                className="h-24 rounded-t-lg relative overflow-hidden"
                style={{ backgroundColor: theme.preview.background }}
              >
                {/* Header bar */}
                <div
                  className="h-8 flex items-center px-3 gap-2"
                  style={{ backgroundColor: theme.preview.muted }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div
                    className="flex-1 h-1 rounded"
                    style={{ backgroundColor: theme.preview.border }}
                  />
                </div>

                {/* Content area */}
                <div className="p-3 space-y-2">
                  <div className="flex gap-2">
                    <div
                      className="w-12 h-3 rounded"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="w-8 h-3 rounded"
                      style={{ backgroundColor: theme.preview.accent }}
                    />
                  </div>
                  <div
                    className="w-full h-2 rounded"
                    style={{ backgroundColor: theme.preview.border }}
                  />
                  <div
                    className="w-3/4 h-2 rounded"
                    style={{ backgroundColor: theme.preview.border }}
                  />
                </div>

                {/* Selection indicator */}
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>

              {/* Theme info */}
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-sm">{theme.name}</h3>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {theme.variant}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {theme.appearance}
                  </Badge>
                </div>
                
                {/* Color palette */}
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: theme.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: theme.preview.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: theme.preview.muted }}
                    title="Muted"
                  />
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: theme.preview.border }}
                    title="Border"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Choose a theme to customize your application's appearance
          </div>
          <Button
            onClick={() => {
              const theme = THEME_OPTIONS.find(t => t.id === selectedTheme);
              if (theme) {
                handleThemeSelect(theme);
              }
            }}
            className="ml-4"
          >
            Apply Theme
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}