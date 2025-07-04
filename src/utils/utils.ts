import { lstatSync, readdirSync } from "fs";
import { TinyMovie } from "../models/tiny-movie.js";
import { LIBRARIES } from "./constants.js";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function nowMinusDays(days: number): number {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.getTime();
}

export function readLibraries(): string[] {
  return LIBRARIES.flatMap((l) => readdirSync(l.dir));
}

export function getDestFilePath(contentPath: string, movie: TinyMovie): string {
  const name = `${movie.title} (${movie.year}) [tmdbid-${movie.id}]`;
  const lib = LIBRARIES.find((l) => name.match(l.regex))!;
  let dest = `${lib.dir}/${name}`;

  if (lstatSync(contentPath).isFile()) {
    dest += contentPath.split(".").pop();
  }

  return dest;
}
