import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from 'store';

import en from './messages/en';
import vi from './messages/vi';

import { Checker } from 'utilities';
import { LOCAL_STORAGE_LANG } from 'core/constant';

Vue.use(VueI18n);

export const LANGUAGES = ['en', 'vi'];
export const DEFAULT_LANGUAGE = 'en';

let user = store.getters['authentication/authUser'];
let user_language = DEFAULT_LANGUAGE;
if (
  Checker.isObject(user) &&
  user.hasOwnProperty('language') &&
  LANGUAGES.includes(user.language)
) {
  user_language = user.language;
} else {
  let localLanguage = localStorage.getItem(LOCAL_STORAGE_LANG);
  if (Checker.hasText(localLanguage) && LANGUAGES.includes(user.language)) {
    user_language = localLanguage;
  }
}
localStorage.setItem(LOCAL_STORAGE_LANG, user_language);

const i18n = new VueI18n({
  locale: user_language,
  fallbackLocale: DEFAULT_LANGUAGE,
  messages: {
    en,
    vi
  }
});

export default i18n;

export const setI18nLanguage = lang => {
  if (!LANGUAGES.includes(lang)) {
    return false;
  }

  i18n.locale = lang;
  localStorage.setItem(LOCAL_STORAGE_LANG, lang);
  document.querySelector('html').setAttribute('lang', lang);

  return true;
};

export const lang = () => {
  return i18n.locale;
};

Vue.prototype.$locale = {
  lang,
  setI18nLanguage,
  DEFAULT_LANGUAGE,
  LANGUAGES
};

const combineMsg = (msg_code, array_attrs) => {
  let attr_vals = [];
  if (Checker.isArray(array_attrs)) {
    for (let i in array_attrs) {
      if (Checker.hasText(array_attrs[i])) {
        attr_vals.push(i18n.t(array_attrs[i]));
      } else if (Checker.isNumber(array_attrs[i])) {
        attr_vals.push(array_attrs[i]);
      }
    }
    return i18n.t(msg_code, attr_vals);
  }
  return '';
};

Vue.prototype.$i18n_tr = class {
  static require = array_attrs => {
    return combineMsg('global.validation.require', array_attrs);
  };

  static min_length = array_attrs => {
    return combineMsg('global.validation.min_length', array_attrs);
  };

  static max_length = array_attrs => {
    return combineMsg('global.validation.max_length', array_attrs);
  };
};
