import { TinyMovie } from "./tiny-movie.js";
import { UnsuccessSearch } from "./unsuccess-search.js";

export interface State {
  movies: TinyMovie[];
  movieScan?: { nextPage: number; startTime: number };
  tvScan?: { nextPage: number; startTime: number };
  unsuccessSearches: UnsuccessSearch[];
  blacklist: string[];
}
