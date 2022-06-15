import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"

import vi from "./locales/vi/translation.json"
import en from "./locales/en/translation.json"

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
}

const language = localStorage.getItem("lang") || "en"

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: language,
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
