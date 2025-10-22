/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Components
import { createVuetify } from "vuetify";
import { VPie } from 'vuetify/labs/VPie';

// Locales de Vuetify
import { en, es, pt } from 'vuetify/locale';

// Servicio para obtener el locale inicial (igual que en main.js)
import LocalStorageService from "@/LocalStorageService";

const getInitialLocale = () => {
  let savedLocale = LocalStorageService.getItem('userLocale');
  const browserLang = navigator.language.split('-')[0];

  if (savedLocale) {
    savedLocale = savedLocale.toString().trim().replace(/^"(.*)"$/, '$1');
  }

  if (savedLocale && ['es', 'en', 'pt'].includes(savedLocale)) {
    return savedLocale;
  } else if (['es', 'en', 'pt'].includes(browserLang)) {
    return browserLang;
  } else {
    return 'es'; // fallback a español
  }
};

const initialLocale = getInitialLocale();

export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
        },
      },
    },
  },
  locale: {
    locale: initialLocale,
    messages: { en, es, pt }
  },
  components: {
    VPie
  },
});