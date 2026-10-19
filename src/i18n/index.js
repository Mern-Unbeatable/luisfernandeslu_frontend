import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import pt from './locales/pt.json'
import es from './locales/es.json'
import catalogEn from './locales/catalog/en.json'
import catalogPt from './locales/catalog/pt.json'
import catalogEs from './locales/catalog/es.json'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', labelKey: 'languages.en' },
  { code: 'pt', labelKey: 'languages.pt' },
  { code: 'es', labelKey: 'languages.es' },
]

export const DEFAULT_LANGUAGE = 'pt'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ...en, catalog: catalogEn } },
      pt: { translation: { ...pt, catalog: catalogPt } },
      es: { translation: { ...es, catalog: catalogEs } },
    },
    // Language switcher is hidden, so ignore a previously stored/browser language.
    // Remove `lng` when the switcher comes back.
    lng: DEFAULT_LANGUAGE,
    fallbackLng: [DEFAULT_LANGUAGE, 'en'],
    supportedLngs: SUPPORTED_LANGUAGES.map((lang) => lang.code),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'construpreco_lang',
    },
  })

export default i18n
