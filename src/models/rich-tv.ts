import { AppendToResponse, TvShowDetails } from "tmdb-ts";

export type RichTv = AppendToResponse<
  TvShowDetails,
  "alternative_titles"[],
  "tvShow"
>;
