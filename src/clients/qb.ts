import { QBittorrent } from "qbit.js";
import { QB_HOST, QB_PASS, QB_USER } from "../utils/secrets.js";

export const qb = new QBittorrent(QB_HOST);
await qb.login(QB_USER, QB_PASS);
