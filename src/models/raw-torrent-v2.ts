import { RawTorrent } from "qbit.js";

export interface RawTorrentV2 extends RawTorrent {
  hash: string;
}
