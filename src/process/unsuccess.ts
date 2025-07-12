import { TinyMovie } from "../models/tiny-movie.js";
import { UnsuccessSearch } from "../models/unsuccess-search.js";
import { state, flushState } from "../state.js";

export function findUnsuccessSearch(
  movie: TinyMovie
): UnsuccessSearch | undefined {
  return state.unsuccessSearches.find(
    (s) => s.movieId === movie.id && s.movieType === movie.type
  );
}

export function cleanUnsuccessSearch(
  search: UnsuccessSearch | undefined
): void {
  if (search) {
    state.unsuccessSearches = state.unsuccessSearches.filter(
      (s) => s !== search
    );
    flushState();
  }
}

export function onUnsuccessSearch(
  search: UnsuccessSearch | undefined,
  movie: TinyMovie
): void {
  if (search) {
    search.searchedOn = Date.now();
  } else {
    const search = {
      movieId: movie.id,
      movieType: movie.type,
      searchedOn: Date.now(),
    };
    state.unsuccessSearches.push(search);
  }

  flushState();
}
