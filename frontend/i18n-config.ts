export const i18n = {
  defaultLocale: "lv",
  locales: ["lv", "en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
