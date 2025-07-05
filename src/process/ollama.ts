import { TinyMovie } from "../models/tiny-movie.js";
import ollama from "ollama";
import { TorrentGroup } from "../models/torrent-group.js";

export async function chooseGroup(
  groups: TorrentGroup[],
  movie: TinyMovie
): Promise<TorrentGroup> {
  const prompt = `Return only the file number that first exactly identifies the following movie in the following file list.

MOVIE
Title: ${movie.title}
Alternative titles: ${movie.altTitles.join(", ")}
Year: ${movie.year}
Alternative years: ${movie.altYears.join(", ")}

FILE LIST
${groups.map((g, i) => `${i}. ${g.name}`).join("\n")}`;

  const response = await ollama.chat({
    model: "gemma3:12b",
    messages: [{ role: "user", content: prompt }],
  });
  const index = Number(response.message.content) - 1;
  return groups[index];
}
