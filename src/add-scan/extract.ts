import { RichMovie } from "../models/rich-movie.js";
import { RichTv } from "../models/rich-tv.js";

export function extractAltTitles(movieOrTv: RichMovie | RichTv): string[] {
  const countries = ["IT", "US", "GB", ...movieOrTv.origin_country];

  const title = (movieOrTv as RichMovie).title ?? (movieOrTv as RichTv).name;
  const originalTitle =
    (movieOrTv as RichMovie).original_title ??
    (movieOrTv as RichTv).original_name;

  const titles = movieOrTv.alternative_titles.titles
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
  const countries = ["IT", "US", "GB", ...movieOrTv.origin_country];

  const releaseDates = (movieOrTv as RichMovie).release_dates ?? [];

  const years = releaseDates.results
    .filter((r) => countries.includes(r.iso_3166_1))
    .flatMap((r) => {
      const dates = r.release_dates
        .map((d) => new Date(d.release_date))
        .sort((a, b) => a.getTime() - b.getTime());
      const minDate = dates[0];
      return [minDate.getFullYear(), minDate.getUTCFullYear()];
    });

  const set = new Set([releaseDate.getUTCFullYear(), ...years]);
  set.delete(releaseDate.getFullYear());

  return [...set];
}
