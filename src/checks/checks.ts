import { existsSync, mkdirSync } from "fs";
import { CATEGORY_DIR, CATEGORY_NAME, LIBRARIES } from "../utils/constants.js";
import { qb } from "../clients/qb.js";

function checkDirs(): void {
  [CATEGORY_DIR, ...LIBRARIES.map((l) => l.dir)]
    .filter((d) => !existsSync(d))
    .forEach((d) => mkdirSync(d, { recursive: true }));
}

async function checkCategory(): Promise<void> {
  const categories = await qb.api.getCategories();

  if (!categories[CATEGORY_NAME]) {
    await qb.api.createCategory(CATEGORY_NAME, CATEGORY_DIR);
  } else if (categories[CATEGORY_NAME].savePath !== CATEGORY_DIR) {
    await qb.api.editCategory(CATEGORY_NAME, CATEGORY_DIR);
  }
}

export async function doChecks(): Promise<void> {
  console.log("[CHECKS] Start");

  checkDirs();
  console.log("[CHECKS] Dirs checked");

  await checkCategory();
  console.log("[CHECKS] Category checked");

  console.log("[CHECKS] End");
}
