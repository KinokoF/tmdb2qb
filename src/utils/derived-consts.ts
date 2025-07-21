import {
  registerLocale,
  toAlpha3B,
  toAlpha3T,
  getName,
} from "@cospired/i18n-iso-languages/index.js";
import { LANG, COUNTRY } from "./constants.js";

const promises = [LANG, "en"]
  .map((l) => `@cospired/i18n-iso-languages/langs/${l}.json`)
  .map((p) => import(p, { with: { type: "json" } }));
(await Promise.all(promises)).forEach((d) => registerLocale(d));

export const LANG_TAG = `${LANG}-${COUNTRY}`;
export const LANG_A3B = toAlpha3B(LANG);
export const LANG_A3T = toAlpha3T(LANG);
export const LANG_LOC_NAME = getName(LANG, LANG)!.toLowerCase();
export const LANG_EN_NAME = getName(LANG, "en")!.toLowerCase();
export const LANGS = LANG_A3B === LANG_A3T ? [LANG_A3B] : [LANG_A3B, LANG_A3T];
