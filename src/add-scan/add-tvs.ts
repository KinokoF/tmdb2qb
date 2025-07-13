import { flushState, state } from "../state.js";
import { tmdb } from "../clients/tmdb.js";
import { sleep } from "../utils/utils.js";
import { minifyTv } from "./minify.js";
import { skipExistingMovie, skipRecentOrUpcomingMovie } from "./skip.js";
import { MIN_DAYS_PASSED_SINCE_RELEASE } from "../utils/constants.js";
import moment from "moment";
import { calcTvRuntime } from "./runtime.js";

export async function addTvs(ids: number[]): Promise<void> {
  console.log("[ADD-TVS] Start");

  const maxReleaseDate = moment()
    .subtract(MIN_DAYS_PASSED_SINCE_RELEASE, "d")
    .format("YYYY-MM-DD");

  for (const id of ids) {
    if (skipExistingMovie("tv", id)) {
      continue;
    }

    const detailsRes = await tmdb.tvShows.details(
      id,
      ["alternative_titles"],
      "it-IT"
    );
    await sleep(20);

    if (
      skipRecentOrUpcomingMovie(detailsRes.first_air_date, maxReleaseDate) ||
      detailsRes.type !== "Miniseries" ||
      detailsRes.status !== "Ended" ||
      detailsRes.number_of_seasons > 1
    ) {
      continue;
    }

    const runtime = await calcTvRuntime(detailsRes);

    state.movies.push(minifyTv(detailsRes, runtime));
    flushState();

    console.log(`[ADD-TVS] #${id}; Added 1 TV shows`);
  }

  console.log("[ADD-TVS] End");
}
