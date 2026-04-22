import en from "@/lib/i18n/locales/en.json";
import id from "@/lib/i18n/locales/id.json";
import { Locale } from "@/stores/locale-store";

export const dictionaries = {
  en,
  id,
} as const satisfies Record<Locale, object>;
