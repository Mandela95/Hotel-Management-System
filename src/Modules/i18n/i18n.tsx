import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // Load translations from /public/locales/{lang}/translation.json
  .use(Backend)
  // Detect user's browser language
  .use(LanguageDetector)
  // Pass i18n to react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    backend: {
      // Path to translation files — uses vite base path for GitHub Pages
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
    },
    detection: {
      // Where to store the selected language
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
