import { state, flushState } from "../state.js";
import {
  MIN_DAYS_PASSED_SINCE_RELEASE,
  MIN_VOTE_COUNT,
  MOVIES_TO_FETCH,
} from "../utils/constants.js";
import { minifyMovies } from "./minify.js";
import { sleep } from "../utils/utils.js";
import { skipExistingMovie } from "./skip.js";
import { tmdb } from "../clients/tmdb.js";
import { scanCollection } from "./collection.js";
import moment from "moment";
import { RichMovie } from "../models/rich-movie.js";
import { LANG_TAG } from "../utils/derived-consts.js";

export async function scanMovies(): Promise<void> {
  console.log("[SCAN-MOVIES] Start");

  if (
    !state.movieScan ||
    state.movieScan.startTime < +moment().subtract(1, "d")
  ) {
    state.movieScan = { nextPage: 1, startTime: Date.now() };
    flushState();
  }

  const maxReleaseDate = moment()
    .subtract(MIN_DAYS_PASSED_SINCE_RELEASE, "d")
    .format("YYYY-MM-DD");
  let totalPages;

  for (
    let i = state.movieScan.nextPage;
    (!totalPages || i <= totalPages) &&
    state.movies.filter((m) => m.type === "movie").length < MOVIES_TO_FETCH;
    i++
  ) {
    const topRatedRes = await tmdb.discover.movie({
      language: LANG_TAG,
      "release_date.lte": maxReleaseDate, // Or primary_release_date.lte?
      "vote_count.gte": MIN_VOTE_COUNT,
      page: i,
      sort_by: "vote_average.desc",
    });
    await sleep(20);

    totalPages = Math.min(topRatedRes.total_pages, 500);

    for (const movie of topRatedRes.results) {
      if (skipExistingMovie("movie", movie.id)) {
        continue;
      }

      const detailsRes = (await tmdb.movies.details(
        movie.id,
        ["release_dates", "alternative_titles"],
        LANG_TAG
      )) as RichMovie;
      await sleep(20);

      const toAdd = [detailsRes];

      if (detailsRes.belongs_to_collection) {
        const relMovies = await scanCollection(
          detailsRes.belongs_to_collection.id,
          [movie.id],
          maxReleaseDate
        );
        toAdd.push(...relMovies);
      }

      state.movies.push(...minifyMovies(toAdd));
      flushState();

      console.log(
        `[SCAN-MOVIES] Page ${i}/${totalPages}; Added ${toAdd.length} movies`
      );
    }

    state.movieScan.nextPage = Math.min(i + 1, totalPages);
    flushState();
  }

  console.log("[SCAN-MOVIES] End");
}
