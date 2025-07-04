import { cpSync } from "fs";
import { RawTorrentV2 } from "../models/raw-torrent-v2.js";
import { TinyMovie } from "../models/tiny-movie.js";
import { qb } from "../clients/qb.js";
import { state, flushState } from "../state.js";
import { getDestFilePath } from "../utils/utils.js";

export async function startDownload(
  torrents: string[],
  movie: TinyMovie
): Promise<void> {
  await qb.checkLogin();
  await qb.api.addTorrent(torrents, {
    paused: false,
    category: "Bot",
    tags: [`tmdbid-${movie.id}`],
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
  await qb.checkLogin();
  await qb.api.deleteTorrents(torrent.hash, true);
}
