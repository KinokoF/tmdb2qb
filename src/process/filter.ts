import Fuse from "fuse.js";
import { state } from "../state.js";
import { VIRUS_REGEXS } from "../utils/constants.js";

function checkName(name: string, titles: string[]): boolean {
  const fuse = new Fuse([name], {
    ignoreDiacritics: true,
    ignoreLocation: true,
    ignoreFieldNorm: true,
    threshold: 0.1,
  });

  return titles.some((t) => fuse.search(t).length);
}

export function filterGroup(
  name: string,
  titles: string[],
  years: number[]
): boolean {
  return (
    !state.blacklist.includes(name) &&
    !VIRUS_REGEXS.some((r) => name.match(r)?.length) &&
    !!name.match("([ _.([-]+|^)(ita|italian)([ _.)\\]-]+|$)")?.length &&
    years.some((y) => name.match(`([ _.([-]+|^)${y}([ _.)\\]-]+|$)`)?.length) &&
    checkName(name, titles)
  );
}
