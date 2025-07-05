import { QBittorrent } from "qbit.js";
import { QBittorrent as CtrlQBittorrent } from "@ctrl/qbittorrent";
import { QB_HOST, QB_PASS, QB_USER } from "../utils/secrets.js";

export const qb = new QBittorrent(QB_HOST);
await qb.login(QB_USER, QB_PASS);

export const ctrlQb = new CtrlQBittorrent({
  baseUrl: QB_HOST,
  username: QB_USER,
  password: QB_PASS,
  timeout: 3_600_000,
});
