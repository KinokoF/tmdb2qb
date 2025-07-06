import { TinyMovie } from "./tiny-movie.js";
import { UnsuccessSearch } from "./unsuccess-search.js";

export interface State {
  movies: TinyMovie[];
  scan?: { nextPage: number; startTime: number };
  unsuccessSearches: UnsuccessSearch[];
  blacklist: string[];
}
