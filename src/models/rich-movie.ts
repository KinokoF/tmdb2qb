import { AppendToResponse, MovieDetails } from "tmdb-ts";

export interface RichMovie
  extends AppendToResponse<
    MovieDetails,
    ("release_dates" | "alternative_titles")[],
    "movie"
  > {
  origin_country: string[];
}
