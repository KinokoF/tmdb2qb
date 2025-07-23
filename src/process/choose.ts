import { chat } from "../clients/oi.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { ResultGroup } from "../models/result-group.js";
import { OI_MODEL, PROMPT_TEMPLATES } from "../utils/constants.js";
import { retryOnError } from "../utils/utils.js";

export async function chooseGroup(
  groups: ResultGroup[],
  movie: TinyMovie
): Promise<ResultGroup> {
  const values = {
    TITLE: movie.title,
    ALT_TITLES: movie.altTitles.join(", "),
    YEAR: String(movie.year),
    ALT_YEARS: movie.altYears.join(", "),
    FILE_LIST: groups.map((g, i) => `${i + 1}. ${g.name}`).join("\n"),
  };
  const prompt = Object.entries(values).reduce(
    (a, [k, v]) => a.replace(k, v),
    PROMPT_TEMPLATES[movie.type]
  );

  const res = await retryOnError(
    () =>
      chat({ model: OI_MODEL, messages: [{ role: "user", content: prompt }] }),
    3,
    5 * 60_000
  );
  const index = Number(res.choices[0].message.content) - 1;
  return groups[index];
}
