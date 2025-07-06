import { TinyMovie } from "../models/tiny-movie.js";
import ollama from "ollama";
import { TorrentGroup } from "../models/torrent-group.js";

export async function chooseGroup(
  groups: TorrentGroup[],
  movie: TinyMovie
): Promise<TorrentGroup> {
  const prompt = `Return ONLY and EXCLUSIVELY the lowest file number that first matches the following movie in the following file list. Avoid files that are trilogies, sagas, or collections. Return -1 if no files match.

MOVIE
Title: ${movie.title}
Alternative titles: ${movie.altTitles.join(", ")}
Year: ${movie.year}
Alternative years: ${movie.altYears.join(", ")}

FILE LIST
${groups.map((g, i) => `${i + 1}. ${g.name}`).join("\n")}`;

  const response = await ollama.chat({
    model: "gemma3:12b",
    messages: [{ role: "user", content: prompt }],
  });
  const index = Number(response.message.content) - 1;
  return groups[index];
}
