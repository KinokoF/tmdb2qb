import { RichMovie } from "../models/rich-movie.js";
import { tmdb } from "../clients/tmdb.js";
import { sleep } from "../utils/utils.js";
import { skipExistingMovie, skipRecentOrUpcomingMovie } from "./skip.js";
import { LOCALE_TAG } from "../utils/constants.js";

export async function scanCollection(
  collectionId: number,
  excludeIds: number[],
  maxReleaseDate: string
): Promise<RichMovie[]> {
  const collectionDetails = await tmdb.collections.details(collectionId, {
    language: LOCALE_TAG,
  });
  await sleep(20);

  const toRet = [];

  for (const movie of collectionDetails.parts) {
    if (
      skipExistingMovie("movie", movie.id) ||
      skipRecentOrUpcomingMovie(movie.release_date, maxReleaseDate) ||
      excludeIds.includes(movie.id)
    ) {
      continue;
    }

    const relatedDetailsRes = (await tmdb.movies.details(
      movie.id,
      ["release_dates", "alternative_titles"],
      LOCALE_TAG
    )) as RichMovie;
    await sleep(20);

    toRet.push(relatedDetailsRes);
  }

  return toRet;
}
