import { RawTorrentV2 } from "../models/raw-torrent-v2.js";
import { loginQb, qb } from "../clients/qb.js";
import { state } from "../state.js";
import {
  CATEGORY_NAME,
  HIGH_QUALITY_THRESHOLD,
  MAX_DAYS_TO_COMPLETE_DOWNLOAD,
  MAX_FILE_SIZE_RUNTIME_COEF,
  MIN_FILE_SIZE_RUNTIME_COEF,
  SEARCH_RETRY_INTERVAL_IN_DAYS,
  TITLE_ALT_WHITESPACES,
} from "../utils/constants.js";
import { searchMovie } from "./search.js";
import { onComplete, onStale, deleteTorrent } from "./torrent.js";
import {
  cleanUnsuccessSearch,
  findUnsuccessSearch,
  onUnsuccessSearch,
} from "./unsuccess.js";
import { findFile, getQbTag, nowMinusDays } from "../utils/utils.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { UnsuccessSearch } from "../models/unsuccess-search.js";
import { RatedResult } from "../models/rated-result.js";
import { calcRating } from "./rating.js";
import { filterResult } from "./filter.js";
import { chooseAndDownload } from "./download.js";

async function searchAndDownloadMovie(
  movie: TinyMovie,
  search?: UnsuccessSearch
): Promise<void> {
  console.log(`[PROCESS] ${movie.title}; Searching...`);

  const minFileSize = movie.runtime * MIN_FILE_SIZE_RUNTIME_COEF * 1024 * 1024;
  const maxFileSize = movie.runtime * MAX_FILE_SIZE_RUNTIME_COEF * 1024 * 1024;

  const titles = [movie.title.toLowerCase(), ...movie.altTitles];
  const years = [movie.year, ...movie.altYears];
  const superTitles = titles.flatMap((t) => [
    t,
    ...TITLE_ALT_WHITESPACES.map((w) => t.replace(" ", w)),
  ]);

  const queries = titles.flatMap((t) => years.map((y) => `${t} ${y} ita`));
  const alreadyTested: RatedResult[] = [];
  const lastChance: RatedResult[] = [];

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const last = i === queries.length - 1;

    console.log(
      `[PROCESS] Query ${i + 1}/${queries.length}; ${query}; Fetching...`
    );

    const results = await searchMovie(query);

    console.log(`[PROCESS] ${movie.title}; Filtering and rating...`);

    const ratedResults = results
      .filter(
        (r) =>
          !alreadyTested.some((t) => t.fileUrl === r.fileUrl) &&
          !lastChance.some((t) => t.fileUrl === r.fileUrl) &&
          filterResult(r, superTitles, years, minFileSize, maxFileSize)
      )
      .map((r) => ({ ...r, rating: calcRating(r.fileName, movie) }));
    const goodOnes = !last
      ? ratedResults.filter((r) => r.rating >= HIGH_QUALITY_THRESHOLD)
      : [...ratedResults, ...lastChance];
    const ok = await chooseAndDownload(goodOnes, movie);

    if (ok) {
      console.log(`[PROCESS] ${movie.title}; Downloading!`);
      cleanUnsuccessSearch(search);
      return;
    }

    alreadyTested.push(...goodOnes);

    const scraps = ratedResults.filter((r) => !goodOnes.includes(r));
    lastChance.push(...scraps);
  }

  console.log(`[PROCESS] ${movie.title}; 404 :(`);
  onUnsuccessSearch(search, movie);
}

export async function processMovies(): Promise<void> {
  console.log("[PROCESS] Start");

  await loginQb();
  const torrents = (await qb.api.getTorrents({
    category: CATEGORY_NAME,
  })) as RawTorrentV2[];

  const searchRetryTime = nowMinusDays(SEARCH_RETRY_INTERVAL_IN_DAYS);
  const staleTorrentTime = nowMinusDays(MAX_DAYS_TO_COMPLETE_DOWNLOAD);

  for (const movie of state.movies) {
    const torrent = torrents.find((t) =>
      t.tags.split(",").includes(getQbTag(movie))
    );
    const file = findFile(movie);
    const search = findUnsuccessSearch(movie);

    if (!torrent && !file && (!search || search.searchedOn < searchRetryTime)) {
      await searchAndDownloadMovie(movie, search);
    } else if (torrent && !file) {
      if (torrent.progress === 1) {
        console.log(`[PROCESS] ${movie.title}; Completed!`);

        await onComplete(torrent, movie);
      } else if (torrent.added_on * 1000 < staleTorrentTime) {
        console.log(`[PROCESS] ${movie.title}; Stale :( Let's try again!`);

        await onStale(torrent);
        await searchAndDownloadMovie(movie);
      } else {
        console.log(`[PROCESS] ${movie.title}; Waiting for completion...`);
      }
    } else if (torrent && file) {
      console.log(`[PROCESS] ${movie.title}; Cleanup`);

      await deleteTorrent(torrent);
    }
  }

  console.log("[PROCESS] End");
}
