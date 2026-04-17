import { getLanguageFromURL, localizedDemoPath, useTranslatedPath } from "./utils";
import ca from "./translations/ca";
import en from "./translations/en";
import es from "./translations/es";
import eus from "./translations/eus";
import fr from "./translations/fr";

export const languages = ["es", "en", "fr", "ca", "eus"];
export const defaultLanguage = "es";
export const translations = { en, es, ca, eus, fr };

export { getLanguageFromURL, localizedDemoPath, useTranslatedPath };

export type Translation = (typeof translations)[keyof typeof translations];
