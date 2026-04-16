import { getLanguageFromURL, localizedDemoPath, useTranslatedPath } from "./utils";
import ca from "./translations/ca";
import en from "./translations/en";
import es from "./translations/es";
import eus from "./translations/eus";

export const languages = ["es", "en", "ca", "eus"];
export const defaultLanguage = "es";
export const translations = { en, es, ca, eus };

export { getLanguageFromURL, localizedDemoPath, useTranslatedPath };

export type Translation = (typeof translations)[keyof typeof translations];
