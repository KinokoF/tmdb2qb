import {
  toAlpha3T,
  toAlpha3B,
  getName,
} from "@cospired/i18n-iso-languages/index.js";
import { TinyMovie } from "../models/tiny-movie.js";
import {
  RES_2160_REGEXS,
  RES_1080_REGEXS,
  RES_720_REGEXS,
  UPSCALED_REGEXS,
  EXTENDED_REGEXS,
  DV_REGEXS,
  HDR10P_REGEXS,
  HDR10_REGEXS,
  HDR_REGEXS,
  TEN_BIT_REGEXS,
  AUD_7_1_REGEXS,
  AUD_5_1_REGEXS,
  AUD_2_1_REGEXS,
  AUD_2_0_REGEXS,
  REMASTERED_REGEXS,
  REPACKED_REGEXS,
  BEST_RIPPER_REGEXS,
  GOOD_RIPPER_REGEXS,
  LOSSLESS_AUD_REGEXS,
  BEST_LOSSY_AUD_REGEXS,
  GOOD_LOSSY_AUD_REGEXS,
  OPTIONAL_LANGS,
  LANG,
} from "../utils/constants.js";

export function calcRating(name: string, movie: TinyMovie): number {
  const loweredName = name.toLowerCase();
  let rating = 0;

  // Resolution
  if (RES_2160_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 3e9;
  } else if (RES_1080_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 2e9;
  } else if (RES_720_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 1e9;
  }

  if (UPSCALED_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating -= 5e8;
  }

  // Extended
  if (EXTENDED_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 5e7;
  }

  // Video features
  if (DV_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 4e6;
  }

  if (HDR10P_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 3e6;
  } else if (HDR10_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 2e6;
  } else if (HDR_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 1e6;
  }

  if (TEN_BIT_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 5e5;
  }

  // Audio features
  if (AUD_7_1_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 4e4;
  } else if (AUD_5_1_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 3e4;
  } else if (AUD_2_1_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 2e4;
  } else if (AUD_2_0_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 1e4;
  }

  if (LOSSLESS_AUD_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 3e3;
  } else if (BEST_LOSSY_AUD_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 2e3;
  } else if (GOOD_LOSSY_AUD_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 1e3;
  }

  // Remastered
  if (REMASTERED_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 500;
  }

  // Other languages
  const compLangs = OPTIONAL_LANGS.map((l) =>
    l === "$ORIGINAL$" ? movie.originalLang : l
  );
  const langs = new Set(compLangs);

  for (const lang of langs) {
    const a3t = toAlpha3T(lang);
    const a3b = toAlpha3B(lang);
    const locName = getName(lang, LANG);
    const enName = getName(lang, "en");

    if (
      loweredName.match(
        `([ _.([-]+|^)(${a3t}|${a3b}|${locName}|${enName})([ _.)\\]-]+|$)`
      )?.length
    ) {
      rating += 100;
    }
  }

  // Ripper
  if (BEST_RIPPER_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 20;
  } else if (GOOD_RIPPER_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 10;
  }

  // Repacked
  if (REPACKED_REGEXS.some((r) => loweredName.match(r)?.length)) {
    rating += 1;
  }

  return rating;
}
