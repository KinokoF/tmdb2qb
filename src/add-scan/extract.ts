import { RichMovie } from "../models/rich-movie.js";
import { RichTv } from "../models/rich-tv.js";
import { COUNTRY } from "../utils/constants.js";

export function extractAltTitles(movieOrTv: RichMovie | RichTv): string[] {
  const countries = [COUNTRY, "US", "GB", ...movieOrTv.origin_country];

  const title = (movieOrTv as RichMovie).title ?? (movieOrTv as RichTv).name;
  const originalTitle =
    (movieOrTv as RichMovie).original_title ??
    (movieOrTv as RichTv).original_name;
  const alternativeTitles =
    (movieOrTv as RichMovie).alternative_titles.titles ??
    (movieOrTv as any).alternative_titles.results;

  const titles = alternativeTitles
    .filter((t) => countries.includes(t.iso_3166_1))
    .map((t) => t.title.toLowerCase());

  const set = new Set([originalTitle.toLowerCase(), ...titles]);
  set.delete(title.toLowerCase());

  return [...set];
}

export function extractAltYears(
  movieOrTv: RichMovie | RichTv,
  releaseDate: Date
): number[] {
  const countries = [COUNTRY, "US", "GB", ...movieOrTv.origin_country];

  const years = (movieOrTv as RichMovie).release_dates
    ? (movieOrTv as RichMovie).release_dates.results
        .filter((r) => countries.includes(r.iso_3166_1))
        .flatMap((r) => {
          const dates = r.release_dates.map((d) => d.release_date).sort();
          const minDate = new Date(dates[0]);
          return [minDate.getFullYear(), minDate.getUTCFullYear()];
        })
    : [];

  const set = new Set([releaseDate.getUTCFullYear(), ...years]);
  set.delete(releaseDate.getFullYear());

  return [...set];
}
