import { QBittorrent } from "qbit.js";
import { QBittorrent as CtrlQBittorrent } from "@ctrl/qbittorrent";
import { QB_HOST, QB_PASS, QB_USER } from "../utils/secrets.js";

// Main client
export let qb: QBittorrent;

export async function loginQb(): Promise<void> {
  qb = new QBittorrent(QB_HOST);
  await qb.login(QB_USER, QB_PASS);
}

// Alt client, only for torrent deletion
export let ctrlQb: CtrlQBittorrent;

export async function loginCtrlQb(): Promise<void> {
  ctrlQb = new CtrlQBittorrent({
    baseUrl: QB_HOST,
    username: QB_USER,
    password: QB_PASS,
    timeout: 3_600_000,
  });
}
