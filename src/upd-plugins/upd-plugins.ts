import { loginQb, qb } from "../clients/qb.js";
import { ProtoPlugin } from "../models/proto-plugin.js";
import { sleep } from "../utils/utils.js";
import { scrapeOfficialPlugins, scrapeLightDestoryPlugins } from "./scrape.js";

export async function updatePlugins(): Promise<void> {
  console.log("[UPD-PLUGINS] Start");

  // await qb.api.updateSearchPlugins();

  const protoPlugins = [
    ...(await scrapeOfficialPlugins()),
    ...(await scrapeLightDestoryPlugins()),
  ].filter((p) => p.working);
  const groupedPlugins = Object.groupBy(protoPlugins, (p) => p.name) as Record<
    string,
    ProtoPlugin[]
  >;
  const sources = Object.entries(groupedPlugins).map(([, v]) => {
    v.sort((a, b) => b.updated - a.updated);
    return v[0].download;
  });

  await loginQb();
  const plugins = await qb.api.getSearchPlugins();
  const names = plugins.map((p) => p.name);
  await qb.api.uninstallSearchPlugin(names);

  console.log("[UPD-PLUGINS] Uninstalling existing plugins; Waiting 1m...");

  await sleep(60_000);

  await loginQb();
  await qb.api.installSearchPlugin(sources);

  console.log(`[UPD-PLUGINS] Installing ${sources.length} plugins; Waiting 1m...`);

  await sleep(60_000);

  console.log("[UPD-PLUGINS] End");
}
