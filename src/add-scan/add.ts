import { flushState, state } from "../state.js";
import { tmdb } from "../clients/tmdb.js";
import { sleep } from "../utils/utils.js";
import { scanCollection } from "./collection.js";
import { minifyMovies } from "./minify.js";
import { skipExistingMovie, skipRecentOrUpcomingMovie } from "./skip.js";
import { MIN_DAYS_PASSED_SINCE_RELEASE } from "../utils/constants.js";
import { RichMovie } from "../models/rich-movie.js";
import moment from "moment";

export async function addMovies(ids: number[]): Promise<void> {
  console.log("[ADD] Start");

  const maxReleaseDate = moment()
    .subtract(MIN_DAYS_PASSED_SINCE_RELEASE, "d")
    .format("YYYY-MM-DD");

  for (const id of ids) {
    if (skipExistingMovie("movie", id)) {
      continue;
    }

    const detailsRes = (await tmdb.movies.details(
      id,
      ["release_dates", "alternative_titles"],
      "it-IT"
    )) as RichMovie;
    await sleep(20);

    if (skipRecentOrUpcomingMovie(detailsRes.release_date, maxReleaseDate)) {
      continue;
    }

    const toAdd = [detailsRes];

    if (detailsRes.belongs_to_collection) {
      const relMovies = await scanCollection(
        detailsRes.belongs_to_collection.id,
        [id],
        maxReleaseDate
      );
      toAdd.push(...relMovies);
    }

    state.movies.push(...minifyMovies(toAdd));
    flushState();

    console.log(`[ADD] #${id}; Added ${toAdd.length} movies`);
  }

  console.log("[ADD] End");
}
