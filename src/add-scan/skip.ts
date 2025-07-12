import { state } from "../state.js";
import { TinyMovieType } from "../models/tiny-movie.js";

export function skipExistingMovie(type: TinyMovieType, id: number): boolean {
  return state.movies.some((m) => m.id === id && m.type === type);
}

export function skipRecentOrUpcomingMovie(
  releaseDate: string,
  maxReleaseDate: string
): boolean {
  return releaseDate === "" || releaseDate > maxReleaseDate;
}
