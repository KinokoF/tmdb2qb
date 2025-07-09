import { RatedResult } from "../models/rated-result.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { TorrentGroup } from "../models/torrent-group.js";
import { eventuallyDecodeUrl } from "../utils/utils.js";
import { chooseGroup } from "./choose.js";
import { startDownload } from "./torrent.js";

function groupResults(results: RatedResult[]): TorrentGroup[] {
  const groupedTorrents = Object.groupBy(results, (r) =>
    r.fileName.toLowerCase()
  );

  return Object.entries(groupedTorrents)
    .map(([k, v]) => ({
      name: k,
      rating: v![0].rating,
      torrents: v!,
    }))
    .sort((a, b) => b.rating - a.rating);
}

export async function chooseAndDownload(
  results: RatedResult[],
  movie: TinyMovie
): Promise<boolean> {
  let groups = groupResults(results);

  while (groups.length) {
    console.log(`[PROCESS.DOWNLOAD] ${movie.title}; Choosing...`);

    const choosenGroup = await chooseGroup(groups, movie);

    if (!choosenGroup) {
      break;
    }

    console.log(
      `[PROCESS.DOWNLOAD] ${movie.title}; Chosen! Trying to download...`
    );

    const urls = choosenGroup.torrents.map((t) =>
      eventuallyDecodeUrl(t.fileUrl)
    );
    const ok = await startDownload(urls, movie);

    if (ok) {
      return true;
    }

    groups = groups.filter((g) => g.name !== choosenGroup.name);
  }

  return false;
}
