import { TinyMovie } from "./tiny-movie.js";
import { UnsuccessSearch } from "./unsuccess-search.js";

export interface State {
  movies: TinyMovie[];
  page: number;
  unsuccessSearches: UnsuccessSearch[];
  blacklist: string[];
}
