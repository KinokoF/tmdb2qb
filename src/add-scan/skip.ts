import { Movie } from "tmdb-ts";
import { state } from "../state.js";

export function skipMovie(movie: Movie, maxReleaseTime: number): boolean {
  return (
    skipExistingMovie(movie.id) ||
    skipRecentOrUpcomingMovie(movie.release_date, maxReleaseTime)
  );
}

export function skipExistingMovie(id: number): boolean {
  return state.movies.some((m) => m.id === id);
}

export function skipRecentOrUpcomingMovie(
  releaseDate: string,
  maxReleaseTime: number
): boolean {
  return releaseDate === "" || new Date(releaseDate).getTime() > maxReleaseTime;
}
