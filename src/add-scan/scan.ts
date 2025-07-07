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
import moment from "moment";

export async function scanMovies(): Promise<void> {
  console.log("[SCAN] Start");

  if (!state.scan || state.scan.startTime < +moment().subtract(1, "d")) {
    state.scan = { nextPage: 1, startTime: Date.now() };
    flushState();
  }

  const maxReleaseTime = nowMinusDays(MIN_DAYS_PASSED_SINCE_RELEASE);
  let totalPages;

  for (
    let i = state.scan.nextPage;
    (!totalPages || i <= totalPages) && state.movies.length < MOVIES_TO_FETCH;
    i++
  ) {
    const topRatedRes = await tmdb.movies.topRated({
      language: "it-IT",
      page: i,
    });
    await sleep(20);

    totalPages = Math.min(topRatedRes.total_pages, 500);

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
      flushState();

      console.log(
        `[SCAN] Page ${i}/${totalPages}; Added ${toAdd.length} movies`
      );
    }

    state.scan.nextPage = Math.min(i + 1, totalPages);
    flushState();
  }

  console.log("[SCAN] End");
}
