import { RichMovie } from "../models/rich-movie.js";

export function extractAltTitles(movie: RichMovie): string[] {
  const countries = ["IT", "US", "GB", ...movie.origin_country];

  const titles = movie.alternative_titles.titles
    .filter((t) => countries.includes(t.iso_3166_1))
    .map((t) => t.title.toLowerCase());

  const set = new Set([movie.original_title.toLowerCase(), ...titles]);
  set.delete(movie.title.toLowerCase());

  return [...set];
}

export function extractAltYears(movie: RichMovie, releaseDate: Date): number[] {
  const countries = ["IT", "US", "GB", ...movie.origin_country];

  const years = movie.release_dates.results
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
