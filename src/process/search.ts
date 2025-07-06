import { RawSearchResult, RawSearchStatusType } from "qbit.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { loginQb, qb } from "../clients/qb.js";
import {
  MIN_FILE_SIZE_RUNTIME_COEF,
  MAX_FILE_SIZE_RUNTIME_COEF,
  TITLE_ALT_WHITESPACES,
} from "../utils/constants.js";
import { filterGroup } from "./filter.js";
import { calcRating } from "./rating.js";
import { sleep } from "../utils/utils.js";
import { TorrentGroup } from "../models/torrent-group.js";

export async function searchMovie(movie: TinyMovie): Promise<TorrentGroup[]> {
  const titles = [movie.title.toLowerCase(), ...movie.altTitles];
  const years = [movie.year, ...movie.altYears];
  const combs = titles.flatMap((title) =>
    years.map((year) => ({ title, year }))
  );

  const minFileSize = movie.runtime * MIN_FILE_SIZE_RUNTIME_COEF * 1024 * 1024;
  const maxFileSize = movie.runtime * MAX_FILE_SIZE_RUNTIME_COEF * 1024 * 1024;

  const torrents: RawSearchResult[] = [];
  let count = 1;

  for (const comb of combs) {
    const query = `${comb.title} ${comb.year} ita`;

    console.log(
      `[PROCESS.SEARCH] Query ${count}/${combs.length}; ${query}; Fetching...`
    );

    await loginQb();
    const searchId = await qb.api.startSearch(query, "enabled", "all");
    let status: RawSearchStatusType;

    do {
      await sleep(4_000);

      const statusRes = await qb.api.getSearchStatus(searchId);
      status = statusRes[0].status;
    } while (status === "Running");

    const resultsRes = await qb.api.getSearchResults({
      id: Number(searchId),
    });
    await qb.api.deleteSearch(searchId);

    const newOnes = resultsRes.results.filter(
      (r) =>
        !torrents.some((t) => t.fileUrl === r.fileUrl) &&
        r.fileSize > minFileSize &&
        r.fileSize < maxFileSize
    );
    torrents.push(...newOnes);

    count++;
  }

  console.log("[PROCESS.SEARCH] Filtering and rating...");

  const superTitles = titles.flatMap((t) => [
    t,
    ...TITLE_ALT_WHITESPACES.map((w) => t.replace(" ", w)),
  ]);
  const groupedTorrents = Object.groupBy(torrents, (t) =>
    t.fileName.toLowerCase()
  );

  return Object.entries(groupedTorrents)
    .filter(([k]) => filterGroup(k, superTitles, years))
    .map(([k, v]) => ({
      name: k,
      rating: calcRating(k, movie),
      torrents: v!,
    }))
    .sort((a, b) => b.rating - a.rating);
}
