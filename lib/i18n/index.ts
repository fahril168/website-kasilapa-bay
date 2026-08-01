import "server-only";

export type Locale = "id" | "en";

export const i18n = {
  defaultLocale: "id" as const,
  locales: ["id", "en"] as const,
};

const dictionaries = {
  id: () => import("./dictionaries/id.json").then((mod) => mod.default),
  en: () => import("./dictionaries/en.json").then((mod) => mod.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
