import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import tr from '../locales/tr.json'
import en from '../locales/en.json'
import ru from '../locales/ru.json'

// URL'den dil tespiti
function detectLanguage(): string {
  const path = window.location.pathname
  if (path.startsWith('/en')) return 'en'
  if (path.startsWith('/ru')) return 'ru'
  return 'tr'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { common: tr },
      en: { common: en },
      ru: { common: ru },
    },
    lng: detectLanguage(),
    fallbackLng: 'tr',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  })

export default i18n
