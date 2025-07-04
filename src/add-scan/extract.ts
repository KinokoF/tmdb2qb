import { RichMovie } from "../models/rich-movie.js";

export function extractTitles(movie: RichMovie): string[] {
  const countries = ["IT", "US", (movie as any).origin_country];

  const altTitles = movie.alternative_titles.titles
    .filter((t) => countries.includes(t.iso_3166_1))
    .map((t) => t.title);
  const titles = [movie.title, movie.original_title, ...altTitles];
  return [...new Set(titles)];
}

export function extractYears(movie: RichMovie): number[] {
  const countries = ["IT", "US", (movie as any).origin_country];

  const date = new Date(movie.release_date);
  const relYears = movie.release_dates.results
    .filter((r) => countries.includes(r.iso_3166_1))
    .flatMap((releaseDate) => {
      const dates = releaseDate.release_dates.map(
        (r) => new Date(r.release_date)
      );
      dates.sort((a, b) => a.getTime() - b.getTime());
      const minDate = dates[0];
      return [minDate.getFullYear(), minDate.getUTCFullYear()];
    });
  const years = [date.getFullYear(), date.getUTCFullYear(), ...relYears];
  return [...new Set(years)];
}
