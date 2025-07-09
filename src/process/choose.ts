import { ChatRequest } from "../models/chat-request.js";
import { ChatResponse } from "../models/chat-response.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { TorrentGroup } from "../models/torrent-group.js";
import { OI_CHAT_ENDPOINT, OI_MODEL } from "../utils/constants.js";
import { OI_TOKEN } from "../utils/secrets.js";
import { retryOnError } from "../utils/utils.js";

export async function chat(request: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(OI_CHAT_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OI_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.detail);
  }

  return body;
}

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

  const res = await retryOnError(
    async () =>
      await chat({
        model: OI_MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    3
  );
  const index = Number(res.choices[0].message.content) - 1;
  return groups[index];
}
