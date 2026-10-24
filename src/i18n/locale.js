import i18n from './index'

const LOCALE_BY_LANGUAGE = {
  pt: 'pt-PT',
  es: 'es-ES',
  en: 'en-GB',
}

export function appLocale() {
  const lang = String(i18n.language || 'pt').slice(0, 2)
  return LOCALE_BY_LANGUAGE[lang] || LOCALE_BY_LANGUAGE.pt
}
