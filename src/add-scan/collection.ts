import { RichMovie } from "../models/rich-movie.js";
import { tmdb } from "../clients/tmdb.js";
import { sleep } from "../utils/utils.js";
import { skipMovie } from "./skip.js";

export async function scanCollection(
  collectionId: number,
  excludeIds: number[],
  maxReleaseTime: number
): Promise<RichMovie[]> {
  const collectionDetails = await tmdb.collections.details(collectionId, {
    language: "it-IT",
  });
  await sleep(20);

  const toRet = [];

  for (const relatedMovie of collectionDetails.parts) {
    if (
      skipMovie(relatedMovie, maxReleaseTime) ||
      excludeIds.includes(relatedMovie.id)
    ) {
      continue;
    }

    const relatedDetailsRes = await tmdb.movies.details(
      relatedMovie.id,
      ["release_dates", "alternative_titles"],
      "it-IT"
    );
    await sleep(20);

    toRet.push(relatedDetailsRes);
  }

  return toRet;
}
