import { RichMovie } from "../models/rich-movie.js";
import { RichTv } from "../models/rich-tv.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { extractAltTitles, extractAltYears } from "./extract.js";

function minifyMovie(movie: RichMovie): TinyMovie {
  const date = new Date(movie.release_date);

  return {
    type: "movie",
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

export function minifyTv(tv: RichTv, runtime: number): TinyMovie {
  const date = new Date(tv.first_air_date);

  return {
    type: "tv",
    id: tv.id,
    title: tv.name,
    originalLang: tv.original_language,
    year: date.getFullYear(),
    runtime,
    altTitles: extractAltTitles(tv),
    altYears: extractAltYears(tv, date),
  };
}
