"use client";

import { useSyncExternalStore } from "react";
import { LaptopMinimal, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/use-translations";

const themeOptions = [
  {
    value: "light",
    labelKey: "theme.light",
    icon: SunMedium,
  },
  {
    value: "dark",
    labelKey: "theme.dark",
    icon: MoonStar,
  },
  {
    value: "system",
    labelKey: "theme.system",
    icon: LaptopMinimal,
  },
] as const;

export function ThemeModeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslations();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <Card className="rounded-3xl border-white/10 bg-white/8 py-0 text-white ring-0">
      <CardContent className="p-4">
        <p className="text-sm text-sky-100 dark:text-slate-300">{t("theme.title")}</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = mounted && theme === option.value;

            return (
              <Button
                key={option.value}
                onClick={() => setTheme(option.value)}
                variant={isActive ? "secondary" : "ghost"}
                className={`h-auto rounded-2xl px-3 py-3 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <span className="flex flex-col items-center gap-2">
                  <Icon className="size-4" />
                  <span className="text-xs font-medium">{t(option.labelKey)}</span>
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
