import { QBittorrent } from "qbit.js";
import { QB_HOST, QB_PASS, QB_USER } from "../utils/secrets.js";

export let qb: QBittorrent;

export async function loginQb(): Promise<void> {
  qb = new QBittorrent(QB_HOST);
  await qb.login(QB_USER, QB_PASS);
}

// Workaround
export async function deleteTorrents(
  hashes: string | string[] | "all",
  deleteFiles: boolean
) {
  await qb.checkLogin();
  const res = await qb.fetch("torrents/delete", {
    method: "POST",
    body: `hashes=${encodeURIComponent(
      Array.isArray(hashes) ? hashes.join("|") : hashes
    )}&deleteFiles=${deleteFiles}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (res.status !== 200) throw new Error(`Unexpected status "${res.status}"`);
}
