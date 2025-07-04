import { RawTorrent } from "qbit.js";

export type RawTorrentV2 = RawTorrent & { hash: string };
