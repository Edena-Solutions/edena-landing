import { getLanguageFromURL, useTranslatedPath } from "./utils";
import en from "./translations/en";
import es from "./translations/es";

export const languages = ["en", "es"];
export const defaultLanguage = "es";
export const translations = { en, es };

export { getLanguageFromURL, useTranslatedPath };

export type Translation = (typeof translations)[keyof typeof translations];
