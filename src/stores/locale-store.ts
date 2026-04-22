import { create } from "zustand";

type Locale = "en" | "id";

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: "en",
  setLocale: (locale) => set({ locale }),
}));
