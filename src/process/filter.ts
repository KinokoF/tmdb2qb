import Fuse from "fuse.js";
import { state } from "../state.js";
import { VIRUS_REGEXS } from "../utils/constants.js";
import { RawSearchResult } from "qbit.js";
import {
  LANG_A3B,
  LANG_A3T,
  LANG_EN_NAME,
  LANG_LOC_NAME,
} from "../utils/derived-consts.js";

function checkName(name: string, titles: string[]): boolean {
  const fuse = new Fuse([name], {
    ignoreDiacritics: true,
    ignoreLocation: true,
    ignoreFieldNorm: true,
    threshold: 0.1,
  });

  return titles.some((t) => fuse.search(t).length);
}

export function filterResult(
  result: RawSearchResult,
  titles: string[],
  years: number[],
  minFileSize: number,
  maxFileSize: number
): boolean {
  const name = result.fileName?.toLowerCase();

  return (
    result.fileSize > minFileSize &&
    result.fileSize < maxFileSize &&
    !!name &&
    !state.blacklist.includes(name) &&
    !VIRUS_REGEXS.some((r) => name.match(r)?.length) &&
    !!name.match(
      `([ _.([-]+|^)(${LANG_A3B}|${LANG_A3T}|${LANG_LOC_NAME}|${LANG_EN_NAME})([ _.)\\]-]+|$)`
    )?.length &&
    years.some((y) => name.match(`([ _.([-]+|^)${y}([ _.)\\]-]+|$)`)?.length) &&
    checkName(name, titles)
  );
}
