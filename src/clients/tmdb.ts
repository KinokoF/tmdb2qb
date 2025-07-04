import { TMDB } from "tmdb-ts";
import { TMDB_TOKEN } from "../utils/secrets.js";

export const tmdb = new TMDB(TMDB_TOKEN);
