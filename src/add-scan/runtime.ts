import { TvShowDetails } from "tmdb-ts";
import { tmdb } from "../clients/tmdb.js";
import { sleep } from "../utils/utils.js";

export async function calcTvRuntime(tv: TvShowDetails): Promise<number> {
  if (tv.episode_run_time.length === 1) {
    return tv.episode_run_time[0] * tv.number_of_episodes;
  }

  const seasons = [];

  for (let i = 1; i <= tv.number_of_seasons; i++) {
    const season = await tmdb.tvSeasons.details({
      tvShowID: tv.id,
      seasonNumber: i,
    });
    await sleep(20);

    seasons.push(season);
  }

  return seasons.flatMap((s) => s.episodes).reduce((a, c) => a + c.runtime, 0);
}
