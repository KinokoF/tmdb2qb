import { RawSearchResult, RawSearchStatusType } from "qbit.js";
import { loginQb, qb } from "../clients/qb.js";
import { sleep } from "../utils/utils.js";

export async function searchMovie(query: string): Promise<RawSearchResult[]> {
  await loginQb();
  const searchId = await qb.api.startSearch(query, "enabled", "all");
  let status: RawSearchStatusType;

  do {
    await sleep(4_000);

    const statusRes = await qb.api.getSearchStatus(searchId);
    status = statusRes[0].status;
  } while (status === "Running");

  const resultsRes = await qb.api.getSearchResults({
    id: Number(searchId),
  });
  await qb.api.deleteSearch(searchId);

  return resultsRes.results;
}
