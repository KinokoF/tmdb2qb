import { cpSync } from "fs";
import { RawTorrentV2 } from "../models/raw-torrent-v2.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { ctrlQb, loginQb, qb } from "../clients/qb.js";
import { state, flushState } from "../state.js";
import { getDestFilePath, getTmdbTag, sleep } from "../utils/utils.js";
import { CATEGORY_NAME } from "../utils/constants.js";

export async function startDownload(
  urls: string[],
  movie: TinyMovie
): Promise<boolean> {
  const tag = getTmdbTag(movie.id);

  await loginQb();
  await qb.api.addTorrent(urls, {
    paused: false,
    category: CATEGORY_NAME,
    tags: [tag],
  });

  // TODO: Verificare che risolva problema torrent doppioni
  await sleep(4_000);

  await loginQb();
  const torrents = await qb.api.getTorrents({ tag });

  return !!torrents.length;
}

export async function onComplete(
  torrent: RawTorrentV2,
  movie: TinyMovie
): Promise<void> {
  const dest = getDestFilePath(torrent.content_path, movie);
  cpSync(torrent.content_path, dest, { recursive: true });

  await deleteTorrent(torrent);
}

export async function onStale(torrent: RawTorrentV2): Promise<void> {
  state.blacklist.push(torrent.name.toLowerCase());
  flushState();

  await deleteTorrent(torrent);
}

export async function deleteTorrent(torrent: RawTorrentV2): Promise<void> {
  await ctrlQb.login();
  await ctrlQb.removeTorrent(torrent.hash, true);
  await ctrlQb.deleteTags(torrent.tags);
}
