import { useTheme } from "@/hooks/use-theme";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Settings, Palette, Monitor, Sun, Moon, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ThemeSettings() {
  const { theme, updateTheme, resetTheme } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = (selectedTheme: any) => {
    updateTheme({
      primary: selectedTheme.primary,
      variant: selectedTheme.variant,
      appearance: selectedTheme.appearance,
      radius: selectedTheme.radius,
    });

    toast({
      title: "Theme Applied",
      description: `${selectedTheme.name} theme has been applied successfully.`,
    });
  };

  const handleAppearanceChange = (appearance: "light" | "dark" | "system") => {
    updateTheme({ appearance });
    toast({
      title: "Appearance Updated",
      description: `Switched to ${appearance} mode.`,
    });
  };

  const handleRadiusChange = (value: number[]) => {
    updateTheme({ radius: value[0] });
  };

  const handleResetTheme = () => {
    resetTheme();
    toast({
      title: "Theme Reset",
      description: "Theme has been reset to default settings.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Theme Settings</h1>
            <p className="text-muted-foreground">
              Customize your application's appearance and color scheme
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleResetTheme}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
      </div>

      {/* Theme Selector */}
      <ThemeSelector
        currentTheme="default-blue"
        onThemeChange={handleThemeChange}
      />

      {/* Advanced Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Appearance Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Label htmlFor="light-mode">Light Mode</Label>
              </div>
              <Switch
                id="light-mode"
                checked={theme.appearance === "light"}
                onCheckedChange={() => handleAppearanceChange("light")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={theme.appearance === "dark"}
                onCheckedChange={() => handleAppearanceChange("dark")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <Label htmlFor="system-mode">System</Label>
              </div>
              <Switch
                id="system-mode"
                checked={theme.appearance === "system"}
                onCheckedChange={() => handleAppearanceChange("system")}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Border Radius</Label>
              <div className="px-3">
                <Slider
                  value={[theme.radius]}
                  onValueChange={handleRadiusChange}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Sharp (0)</span>
                <span>Current: {theme.radius.toFixed(1)}</span>
                <span>Rounded (2)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Theme Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Current Theme Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Theme info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Primary Color:</span>
                  <div
                    className="w-6 h-6 rounded border-2 border-border"
                    style={{ backgroundColor: theme.primary }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Variant:</span>
                  <span className="text-sm capitalize">{theme.variant}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Appearance:</span>
                  <span className="text-sm capitalize">{theme.appearance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Border Radius:</span>
                  <span className="text-sm">{theme.radius}rem</span>
                </div>
              </div>

              <Separator />

              {/* Component preview */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Component Preview</h4>
                
                <div className="space-y-2">
                  <Button className="w-full">Primary Button</Button>
                  <Button variant="secondary" className="w-full">
                    Secondary Button
                  </Button>
                  <Button variant="outline" className="w-full">
                    Outline Button
                  </Button>
                </div>

                <Card className="p-3">
                  <h5 className="font-medium mb-2">Sample Card</h5>
                  <p className="text-sm text-muted-foreground">
                    This is how cards will look with your current theme settings.
                  </p>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}