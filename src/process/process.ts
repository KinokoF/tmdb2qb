import { RawTorrentV2 } from "../models/raw-torrent-v2.js";
import { loginQb, qb } from "../clients/qb.js";
import { state } from "../state.js";
import {
  CATEGORY_NAME,
  MAX_DAYS_TO_COMPLETE_DOWNLOAD,
  SEARCH_RETRY_INTERVAL_IN_DAYS,
} from "../utils/constants.js";
import { searchMovie } from "./search.js";
import {
  startDownload,
  onComplete,
  onStale,
  deleteTorrent,
} from "./torrent.js";
import { cleanUnsuccessSearch, onUnsuccessSearch } from "./unsuccess.js";
import {
  eventuallyDecodeUrl,
  getTmdbTag,
  nowMinusDays,
  readLibraries,
} from "../utils/utils.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { UnsuccessSearch } from "../models/unsuccess-search.js";
import { chooseGroup } from "./ollama.js";

async function searchAndDownloadMovie(
  movie: TinyMovie,
  search?: UnsuccessSearch
): Promise<void> {
  console.log(`[PROCESS] ${movie.title}; Searching...`);

  let groups = await searchMovie(movie);

  while (groups.length) {
    console.log(`[PROCESS] ${movie.title}; Choosing...`);

    const choosenGroup = await chooseGroup(groups, movie);

    if (!choosenGroup) {
      break;
    }

    console.log(`[PROCESS] ${movie.title}; Chosen! Trying to download...`);

    const urls = choosenGroup.torrents.map((t) =>
      eventuallyDecodeUrl(t.fileUrl)
    );
    const ok = await startDownload(urls, movie);

    if (ok) {
      console.log(`[PROCESS] ${movie.title}; Downloading!`);
      cleanUnsuccessSearch(search);
      return;
    }

    groups = groups.filter((g) => g.name !== choosenGroup.name);
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
      t.tags.split(",").includes(getTmdbTag(movie.id))
    );
    const file = readLibraries().find((f) =>
      f.includes(getTmdbTag(movie.id, true))
    );
    const search = state.unsuccessSearches.find((s) => s.movieId === movie.id);

    if (!torrent && !file && (!search || search.searchedOn < searchRetryTime)) {
      await searchAndDownloadMovie(movie, search);
    } else if (torrent && !file) {
      if (torrent.completion_on > -1) {
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
    } else {
      console.log(`[PROCESS] ${movie.title}; Already in the library`);
    }
  }

  console.log("[PROCESS] End");
}
