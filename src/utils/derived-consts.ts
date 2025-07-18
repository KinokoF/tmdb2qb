import {
  toAlpha3B,
  toAlpha3T,
  getName,
} from "@cospired/i18n-iso-languages/index.js";
import { LOCALE_TAG } from "./constants.js";

export const LOCALE = new Intl.Locale(LOCALE_TAG);
export const LANG = {
  a3b: toAlpha3B(LOCALE.language),
  a3t: toAlpha3T(LOCALE.language),
  locName: getName(LOCALE.language, LOCALE.language),
  enName: getName(LOCALE.language, "en"),
};
export const LANGS = LANG.a3b === LANG.a3t ? [LANG.a3b] : [LANG.a3b, LANG.a3t];
