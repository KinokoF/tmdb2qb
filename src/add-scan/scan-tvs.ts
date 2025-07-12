import { state, flushState } from "../state.js";
import {
  MIN_DAYS_PASSED_SINCE_RELEASE,
  MIN_VOTE_COUNT,
  TVS_TO_FETCH,
} from "../utils/constants.js";
import { minifyTv } from "./minify.js";
import { sleep } from "../utils/utils.js";
import { skipExistingMovie } from "./skip.js";
import { tmdb } from "../clients/tmdb.js";
import moment from "moment";
import { calcTvRuntime } from "./runtime.js";

export async function scanTvs(): Promise<void> {
  console.log("[SCAN-TVS] Start");

  if (!state.tvScan || state.tvScan.startTime < +moment().subtract(1, "d")) {
    state.tvScan = { nextPage: 1, startTime: Date.now() };
    flushState();
  }

  const maxReleaseDate = moment()
    .subtract(MIN_DAYS_PASSED_SINCE_RELEASE, "d")
    .format("YYYY-MM-DD");
  let totalPages;

  for (
    let i = state.tvScan.nextPage;
    (!totalPages || i <= totalPages) &&
    state.movies.filter((m) => m.type === "tv").length < TVS_TO_FETCH;
    i++
  ) {
    // TYPES
    // 0 => Documentary
    // 1 => News
    // 2 => Miniseries
    // 3 => Reality
    // 4 => Scripted (standard TV series)
    // 5 => Talk Show
    // 6 => Video

    // STATUSES
    // 0 => Returning Series
    // 1 => Returning Series (not released)
    // 2 => In Production
    // 3 => Ended
    // 4 => Canceled
    // 5 => Pilot
    const topRatedRes = await tmdb.discover.tvShow({
      language: "it-IT",
      "first_air_date.lte": maxReleaseDate, // Or air_date.lte?
      "vote_count.gte": MIN_VOTE_COUNT,
      with_type: "2",
      with_status: "3",
      page: i,
      sort_by: "vote_average.desc",
    });
    await sleep(20);

    totalPages = Math.min(topRatedRes.total_pages, 500);

    for (const tv of topRatedRes.results) {
      if (skipExistingMovie("tv", tv.id)) {
        continue;
      }

      const detailsRes = await tmdb.tvShows.details(
        tv.id,
        ["alternative_titles"],
        "it-IT"
      );
      await sleep(20);

      if (detailsRes.number_of_seasons > 1) {
        continue;
      }

      const runtime = await calcTvRuntime(detailsRes);

      state.movies.push(minifyTv(detailsRes, runtime));
      flushState();

      console.log(`[SCAN-TVS] Page ${i}/${totalPages}; Added 1 TV shows`);
    }

    state.tvScan.nextPage = Math.min(i + 1, totalPages);
    flushState();
  }

  console.log("[SCAN-TVS] End");
}
