import { chat } from "../clients/oi.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { ResultGroup } from "../models/result-group.js";
import { OI_MODEL } from "../utils/constants.js";
import { retryOnError } from "../utils/utils.js";

export async function chooseGroup(
  groups: ResultGroup[],
  movie: TinyMovie
): Promise<ResultGroup> {
  const prompt = `Return ONLY and EXCLUSIVELY the lowest file number that first matches the following movie in the following file list. Avoid files that are trilogies, sagas, or collections. Return -1 if no files match.

MOVIE
Title: ${movie.title}
Alternative titles: ${movie.altTitles.join(", ")}
Year: ${movie.year}
Alternative years: ${movie.altYears.join(", ")}

FILE LIST
${groups.map((g, i) => `${i + 1}. ${g.name}`).join("\n")}`;

  const res = await retryOnError(
    async () =>
      await chat({
        model: OI_MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    3,
    30_000
  );
  const index = Number(res.choices[0].message.content) - 1;
  return groups[index];
}
