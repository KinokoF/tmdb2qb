import { fromURL } from "cheerio";
import moment from "moment";
import { ProtoPlugin } from "../models/proto-plugin.js";
import {
  OFFICIAL_PLUGINS_REPO,
  BROKEN_PLUGIN_CHARS,
  LIGHT_DESTORY_PLUGINS_REPO,
} from "../utils/constants.js";

export async function scrapeOfficialPlugins(): Promise<ProtoPlugin[]> {
  const $ = await fromURL(OFFICIAL_PLUGINS_REPO);

  return $("div.markdown-body table:first-of-type tr:not(:first-of-type)")
    .map((_, e) => {
      const lastUpdate = $(e).find("td:nth-child(4)").html();
      const download = $(e).find("td:nth-child(5) a").attr("href")!;
      const comments = $(e).find("td:nth-child(6)").text();

      const url = new URL(download);
      const name = url.pathname.split("/").pop()!;
      const updated = moment(lastUpdate, "DD/MMM<br>YYYY").unix();
      const working = !BROKEN_PLUGIN_CHARS.some((c) => comments.includes(c));

      return { name, updated, working, download };
    })
    .toArray();
}

export async function scrapeLightDestoryPlugins(): Promise<ProtoPlugin[]> {
  const $ = await fromURL(LIGHT_DESTORY_PLUGINS_REPO);

  return $("article.markdown-body table tbody tr")
    .map((_, e) => {
      const rawUpdated = $(e).find("td:nth-child(3) em").text();
      const rawWorking = $(e).find("td:nth-child(4)").text();
      const download = $(e).find("td:nth-child(5) a").attr("href")!;

      const url = new URL(download);
      const name = url.pathname.split("/").pop()!;
      const updated = moment(rawUpdated, "(DD/MM/YYYY)").unix();
      const working = !BROKEN_PLUGIN_CHARS.includes(rawWorking);

      return { name, updated, working, download };
    })
    .toArray();
}
