import type { Locale } from "@/config/site";
import type esDictionary from "./es.json";

export type Dictionary = typeof esDictionary;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import("./es.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
