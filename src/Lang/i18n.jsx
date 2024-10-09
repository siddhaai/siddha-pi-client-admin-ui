import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './english.json';
import translationES from './spanish.json';
import translationZH from './chinese.json';
import translationTL from './tagalog.json';
import translationVI from './vietnamese.json';
import translationAr from './arabic.json';
import translationFr from './french.json';

// Retrieve the language from local storage or use 'en' as default
const storedLanguage = localStorage.getItem('language') || 'en';

// The translations
const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  zh: {
    translation: translationZH
  },
  tl: {
    translation: translationTL
  },
  vi: {
    translation: translationVI
  },
  ar: {
    translation: translationAr
  },
  fr: {
    translation: translationFr
  }
};

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: storedLanguage, // Set the initial language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already handles XSS
    }
  });

export default i18n;
