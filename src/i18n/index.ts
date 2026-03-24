import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '@/content/en/common.json';
import enAuth from '@/content/en/auth.json';
import enDashboard from '@/content/en/dashboard.json';
import enTickets from '@/content/en/tickets.json';
import enUsers from '@/content/en/users.json';

import esCommon from '@/content/es/common.json';
import esAuth from '@/content/es/auth.json';
import esDashboard from '@/content/es/dashboard.json';
import esTickets from '@/content/es/tickets.json';
import esUsers from '@/content/es/users.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard,
        tickets: enTickets,
        users: enUsers,
      },
      es: {
        common: esCommon,
        auth: esAuth,
        dashboard: esDashboard,
        tickets: esTickets,
        users: esUsers,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard', 'tickets', 'users'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'helpdesk_language',
      caches: ['localStorage'],
    },
  });

export default i18n;
