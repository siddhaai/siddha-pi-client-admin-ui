import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./enTransLat.json";
import translationES from "./spanish.json";
import translationZH from "./chinese.json";
import translationTL from "./tagalog.json";
import translationVI from "./vietnamese.json";
import translationFR from "./french.json";

// Retrieve the language from local storage
const storedLanguage = localStorage.getItem("language") || "en"; // default to 'en' if no language is stored

// The translations
const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  zh: {
    translation: translationZH,
  },
  tl: {
    translation: translationTL,
  },
  vi: {
    translation: translationVI,
  },
  fr: {
    translation: translationFR,
  },
};

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: storedLanguage, // Set the initial language
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
