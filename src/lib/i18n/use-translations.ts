"use client";

import { dictionaries } from "@/lib/i18n/dictionaries";
import { Locale, useLocaleStore } from "@/stores/locale-store";

type TranslationValues = Record<string, string | number>;

function getTranslationValue(
  locale: Locale,
  key: string,
): string {
  const value = key.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, dictionaries[locale]);

  return typeof value === "string" ? value : key;
}

function interpolate(template: string, values?: TranslationValues) {
  if (!values) {
    return template;
  }

  return Object.entries(values).reduce((result, [key, value]) => {
    return result.replaceAll(`{${key}}`, String(value));
  }, template);
}

export function useTranslations() {
  const locale = useLocaleStore((state) => state.locale);

  return {
    locale,
    t: (key: string, values?: TranslationValues) =>
      interpolate(getTranslationValue(locale, key), values),
  };
}
