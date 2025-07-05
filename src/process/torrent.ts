import { cpSync } from "fs";
import { RawTorrentV2 } from "../models/raw-torrent-v2.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { ctrlQb, qb } from "../clients/qb.js";
import { state, flushState } from "../state.js";
import { getDestFilePath, getTmdbTag } from "../utils/utils.js";
import { CATEGORY_NAME } from "../utils/constants.js";

export async function startDownload(
  torrents: string[],
  movie: TinyMovie
): Promise<void> {
  await qb.checkLogin();
  await qb.api.addTorrent(torrents, {
    paused: false,
    category: CATEGORY_NAME,
    tags: [getTmdbTag(movie.id)],
  });
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
  state.blacklist.push(torrent.name);
  flushState();

  await deleteTorrent(torrent);
}

export async function deleteTorrent(torrent: RawTorrentV2): Promise<void> {
  await ctrlQb.removeTorrent(torrent.hash, true);
}
