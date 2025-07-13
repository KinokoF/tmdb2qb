import { addMovies } from "./add-scan/add-movies.js";
import { scanTvs } from "./add-scan/scan-tvs.js";
import { scanMovies } from "./add-scan/scan-movies.js";
import { doChecks } from "./checks/checks.js";
import { processMovies } from "./process/process.js";
import { updatePlugins } from "./upd-plugins/upd-plugins.js";
import { extractArgIds, sleep } from "./utils/utils.js";
import { addTvs } from "./add-scan/add-tvs.js";

/*

TODO

- Scremare titoli alternativi che sono superset ???
- Esporre pagina web ???

*/

const movieIds = extractArgIds("add-movies");

if (movieIds?.length) {
  await addMovies(movieIds);
}

const tvIds = extractArgIds("add-tvs");

if (tvIds?.length) {
  await addTvs(tvIds);
}

do {
  if (!process.argv.includes("no-scan")) {
    if (!process.argv.includes("no-scan-movies")) {
      await scanMovies();
    }

    if (!process.argv.includes("no-scan-tvs")) {
      await scanTvs();
    }
  }

  if (!process.argv.includes("no-checks")) {
    await doChecks();
  }

  if (!process.argv.includes("no-upd-plugins")) {
    await updatePlugins();
  }

  if (!process.argv.includes("no-process")) {
    await processMovies();
  }

  if (!process.argv.includes("no-loop")) {
    console.log("[MAIN] Waiting 1h...");
    await sleep(3_600_000);
  }
} while (!process.argv.includes("no-loop"));
