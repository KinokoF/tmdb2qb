import { existsSync, readFileSync, writeFileSync } from "fs";
import { INITIAL_STATE } from "./utils/constants.js";
import { State } from "./models/state.js";

if (!existsSync("state.json")) {
  const json = JSON.stringify(INITIAL_STATE);
  writeFileSync("state.json", json);
}

const json = readFileSync("state.json", { encoding: "utf8" });
export const state: State = JSON.parse(json);

export function flushState() {
  const json = JSON.stringify(state);
  writeFileSync("state.json", json);
}
