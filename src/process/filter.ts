import Fuse from "fuse.js";
import { RawSearchResult } from "qbit.js";
import { state } from "../state.js";
import { TITLE_ALT_WHITESPACES, VIRUS_REGEXS } from "../utils/constants.js";

function checkName(loweredFileName: string, title: string): boolean {
  const fuse = new Fuse([loweredFileName], {
    ignoreDiacritics: true,
    ignoreLocation: true,
    ignoreFieldNorm: true,
    threshold: 0.1,
  });

  return [
    title,
    ...TITLE_ALT_WHITESPACES.map((c) => title.replace(" ", c)),
  ].some((t) => fuse.search(t).length);
}

export function filterTorrent(
  r: RawSearchResult,
  minFileSize: number,
  maxFileSize: number,
  title: string,
  year: number
): boolean {
  const loweredFileName = r.fileName.toLowerCase();

  return (
    r.fileSize > minFileSize &&
    r.fileSize < maxFileSize &&
    !state.blacklist.includes(r.fileName) &&
    !VIRUS_REGEXS.some((re) => loweredFileName.match(re)?.length) &&
    !!loweredFileName.match(`([ _.([-]+|^)${year}([ _.)\\]-]+|$)`)?.length &&
    !!loweredFileName.match("([ _.([-]+|^)(ita|italian)([ _.)\\]-]+|$)")
      ?.length &&
    checkName(loweredFileName, title)
  );
}
