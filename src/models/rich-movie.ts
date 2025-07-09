import { AppendToResponse, MovieDetails } from "tmdb-ts";

export type RichMovie = AppendToResponse<
  MovieDetails,
  ("release_dates" | "alternative_titles")[],
  "movie"
> & { origin_country: string[] };
