import { readdirSync } from "fs";
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

export function getTmdbTag(id: number, brackets?: boolean): string {
  const tag = `tmdbid-${id}`;

  return brackets ? `[${tag}]` : tag;
}

export function eventuallyDecodeUrl(url: string): string {
  return url.match(/^(https?|magnet)%3A/) ? decodeURIComponent(url) : url;
}
