import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enJSON from "@/locales/en.json";
import arJSON from "@/locales/ar.json";
import mlJSON from "@/locales/ml.json";
import urJSON from "@/locales/ur.json";

// Type assertion to fix TypeScript issues
const i18nInstance = i18n as any;

// Set up i18next
i18nInstance
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enJSON },
      ar: { translation: arJSON },
      ml: { translation: mlJSON },
      ur: { translation: urJSON },
    },
    fallbackLng: "en",
    debug: false,
lng: undefined, // ← يتركه للكشف التلقائي
    defaultNS: "translation",
    ns: ["translation"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

console.log("i18next resources loaded:", {
  en: !!enJSON?.translation?.auth,
  ar: !!arJSON?.translation?.auth,
  ml: !!mlJSON?.translation?.auth,
  ur: !!urJSON?.translation?.auth,
});

export default i18n;
