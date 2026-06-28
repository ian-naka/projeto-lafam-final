import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en';
import ptBR from './pt-BR';

void i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': {
      translation: ptBR,
    },
    en: {
      translation: en,
    },
  },
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
