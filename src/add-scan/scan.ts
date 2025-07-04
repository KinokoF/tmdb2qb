import { state, flushState } from "../state.js";
import {
  MIN_DAYS_PASSED_SINCE_RELEASE,
  MOVIES_TO_FETCH,
} from "../utils/constants.js";
import { minifyMovies } from "./minify.js";
import { nowMinusDays, sleep } from "../utils/utils.js";
import { skipMovie } from "./skip.js";
import { tmdb } from "../clients/tmdb.js";
import { scanCollection } from "./collection.js";

export async function scanMovies(): Promise<void> {
  console.log("[SCAN] Start");

  const maxReleaseTime = nowMinusDays(MIN_DAYS_PASSED_SINCE_RELEASE);
  let topRatedRes;

  for (
    let i = state.page;
    (!topRatedRes || i <= topRatedRes.total_pages) &&
    state.movies.length < MOVIES_TO_FETCH;
    i++
  ) {
    topRatedRes = await tmdb.movies.topRated({
      language: "it-IT",
      page: i,
    });
    await sleep(20);

    for (const movie of topRatedRes.results) {
      if (skipMovie(movie, maxReleaseTime)) {
        continue;
      }

      const detailsRes = await tmdb.movies.details(
        movie.id,
        ["release_dates", "alternative_titles"],
        "it-IT"
      );
      await sleep(20);

      const toAdd = [detailsRes];

      if (detailsRes.belongs_to_collection) {
        const relMovies = await scanCollection(
          detailsRes.belongs_to_collection.id,
          [movie.id],
          maxReleaseTime
        );
        toAdd.push(...relMovies);
      }

      state.movies.push(...minifyMovies(toAdd));
      state.page = i;
      flushState();

      console.log(
        `[SCAN] Page ${i}/${topRatedRes.total_pages}; Added ${toAdd.length} movies`
      );
    }
  }

  console.log("[SCAN] End");
}
