import { RatedResult } from "../models/rated-result.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { ResultGroup } from "../models/result-group.js";
import { eventuallyDecodeUrl } from "../utils/utils.js";
import { chooseGroup } from "./choose.js";
import { startDownload } from "./torrent.js";

function groupResults(results: RatedResult[]): ResultGroup[] {
  const groupedResults = Object.groupBy(results, (r) =>
    r.fileName.toLowerCase()
  );

  return Object.entries(groupedResults)
    .map(([k, v]) => ({
      name: k,
      rating: v![0].rating,
      results: v!,
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

    const urls = choosenGroup.results.map((t) =>
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
