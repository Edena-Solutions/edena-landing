import { getLanguageFromURL, useTranslatedPath } from "./utils";
import ca from "./translations/ca";
import en from "./translations/en";
import es from "./translations/es";

export const languages = ["es", "ca", "en"];
export const defaultLanguage = "es";
export const translations = { en, es, ca };

export { getLanguageFromURL, useTranslatedPath };

export type Translation = (typeof translations)[keyof typeof translations];
