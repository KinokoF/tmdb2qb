import { qb } from "../clients/qb.js";
import { CATEGORY_DIR, CATEGORY_NAME } from "../utils/constants.js";

export async function updateCategory() {
  console.log("[UPD-CATEGORY] Start");

  const categories = await qb.api.getCategories();

  if (!categories[CATEGORY_NAME]) {
    await qb.api.createCategory(CATEGORY_NAME, CATEGORY_DIR);
  } else if (categories[CATEGORY_NAME].savePath !== CATEGORY_DIR) {
    await qb.api.editCategory(CATEGORY_NAME, CATEGORY_DIR);
  }

  console.log("[UPD-CATEGORY] End");
}
