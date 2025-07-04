import { TinyMovie } from "../models/tiny-movie.js";
import { UnsuccessSearch } from "../models/unsuccess-search.js";
import { state, flushState } from "../state.js";

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
    const search = { movieId: movie.id, searchedOn: Date.now() };
    state.unsuccessSearches.push(search);
  }

  flushState();
}
