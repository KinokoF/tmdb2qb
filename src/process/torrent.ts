import { cpSync, lstatSync, renameSync } from "fs";
import { RawTorrentV2 } from "../models/raw-torrent-v2.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { deleteTorrents, loginQb, qb, resumeTorrents } from "../clients/qb.js";
import { state, flushState } from "../state.js";
import { getQbTag, getTmdbTag, sleep } from "../utils/utils.js";
import { CATEGORY_NAME, LIBRARIES } from "../utils/constants.js";
import { extname } from "path";

export async function startDownload(
  urls: string[],
  movie: TinyMovie
): Promise<boolean> {
  const tag = getQbTag(movie);

  await loginQb();
  await qb.api.addTorrent(urls, {
    paused: true,
    category: CATEGORY_NAME,
    tags: [tag],
  });

  await sleep(urls.length * 10_000);

  await loginQb();
  const torrents = (await qb.api.getTorrents({
    category: CATEGORY_NAME,
    tag,
    sort: "added_on",
  })) as RawTorrentV2[];

  if (torrents.length > 0) {
    await resumeTorrents(torrents[0].hash);

    if (torrents.length > 1) {
      const hashes = torrents.slice(1).map((t) => t.hash);
      await deleteTorrents(hashes, false);
    }
  }

  return !!torrents.length;
}

export async function onComplete(
  torrent: RawTorrentV2,
  movie: TinyMovie
): Promise<void> {
  const name = `${movie.title} (${movie.year}) ${getTmdbTag(movie.id)}`;
  const lib = LIBRARIES.filter((l) => l.type === movie.type).find((l) =>
    name.match(l.regex)
  )!;

  if (lstatSync(torrent.content_path).isFile()) {
    const ext = extname(torrent.content_path);

    try {
      renameSync(torrent.content_path, `${lib.dir}/${name}${ext}`);
    } catch (error: any) {
      if (error.code === "EXDEV") {
        cpSync(torrent.content_path, `${lib.dir}/${name}${ext}`);
      } else {
        throw error;
      }
    }
  } else {
    cpSync(torrent.content_path, `${lib.dir}/${name}`, { recursive: true });
  }

  await deleteTorrent(torrent);
}

export async function onStale(torrent: RawTorrentV2): Promise<void> {
  state.blacklist.push(torrent.name.toLowerCase());
  flushState();

  await deleteTorrent(torrent);
}

export async function deleteTorrent(torrent: RawTorrentV2): Promise<void> {
  await loginQb();
  await deleteTorrents(torrent.hash, true);
  await qb.api.deleteTags(torrent.tags);
}
