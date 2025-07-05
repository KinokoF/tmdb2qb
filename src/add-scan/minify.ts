import { RichMovie } from "../models/rich-movie.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { extractAltTitles, extractAltYears } from "./extract.js";

function minifyMovie(movie: RichMovie): TinyMovie {
  const date = new Date(movie.release_date);

  return {
    id: movie.id,
    title: movie.title,
    originalLang: movie.original_language,
    year: date.getFullYear(),
    runtime: movie.runtime,
    altTitles: extractAltTitles(movie),
    altYears: extractAltYears(movie, date),
  };
}

export function minifyMovies(movies: RichMovie[]): TinyMovie[] {
  return movies.map((m) => minifyMovie(m));
}
