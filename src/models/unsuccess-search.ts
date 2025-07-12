import { TinyMovieType } from "./tiny-movie.js";

export interface UnsuccessSearch {
  movieId: number;
  movieType: TinyMovieType;
  searchedOn: number;
}
