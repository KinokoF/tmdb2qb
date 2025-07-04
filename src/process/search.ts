import { RawSearchResult, RawSearchStatusType } from "qbit.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { qb } from "../clients/qb.js";
import {
  MIN_FILE_SIZE_RUNTIME_COEF,
  MAX_FILE_SIZE_RUNTIME_COEF,
} from "../utils/constants.js";
import { filterTorrent } from "./filter.js";
import { calcRating } from "./rating.js";
import { sleep } from "../utils/utils.js";

export async function searchMovie(movie: TinyMovie): Promise<string[]> {
  const combs = movie.titles.flatMap((t) =>
    movie.years.map((y) => ({ title: t, year: y }))
  );

  const minFileSize = movie.runtime * MIN_FILE_SIZE_RUNTIME_COEF * 1024 * 1024;
  const maxFileSize = movie.runtime * MAX_FILE_SIZE_RUNTIME_COEF * 1024 * 1024;

  const torrents: RawSearchResult[] = [];

  for (const comb of combs) {
    const query = `${comb.title} ${comb.year} ita`;

    await qb.checkLogin();
    const searchId = await qb.api.startSearch(query, "enabled", "all");

    let status: RawSearchStatusType;

    do {
      await sleep(10_000);

      await qb.checkLogin();
      const statusRes = await qb.api.getSearchStatus(searchId);

      status = statusRes[0].status;
    } while (status === "Running");

    await qb.checkLogin();
    const resultsRes = await qb.api.getSearchResults({
      id: Number(searchId),
    });

    const newOnes = resultsRes.results.filter(
      (r) =>
        !torrents.some((t) => t.fileUrl === r.fileUrl) &&
        filterTorrent(r, minFileSize, maxFileSize, comb.title, comb.year)
    );
    torrents.push(...newOnes);
  }

  const groupedTorrents = Object.groupBy(torrents, (t) => t.fileName);
  const torrentGroups = Object.entries(groupedTorrents).map(([k, v]) => ({
    rating: calcRating(k, movie),
    torrents: v!,
  }));
  torrentGroups.sort((a, b) => b.rating - a.rating);

  return torrentGroups[0]?.torrents.map((t) => t.fileUrl) ?? [];
}
