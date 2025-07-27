import { readdirSync } from "fs";
import { LIBRARIES } from "./constants.js";
import { isPromise } from "util/types";
import { TinyMovie } from "../models/tiny-movie.js";

export function extractArgIds(arg: string): number[] | undefined {
  return process.argv
    .find((a) => a.startsWith(`${arg}=`))
    ?.split("=")
    .pop()!
    .split(",")
    .map(Number);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function nowMinusDays(days: number): number {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.getTime();
}

export function findFile(movie: TinyMovie): string | undefined {
  return LIBRARIES.filter((l) => l.type === movie.type)
    .flatMap((l) => readdirSync(l.dir))
    .find((f) => f.includes(getTmdbTag(movie.id)));
}

export function getQbTag(movie: TinyMovie): string {
  switch (movie.type) {
    case "movie":
      return `movie-${movie.id}`;
    case "tv":
      return `tv-${movie.id}`;
  }
}

export function getTmdbTag(id: number): string {
  return `[tmdbid-${id}]`;
}

export function eventuallyDecodeUrl(url: string): string {
  return url.match(/^(https?|magnet)%3A/) ? decodeURIComponent(url) : url;
}

export async function retryOnError<T>(
  fn: () => T | Promise<T>,
  maxAttempts = 3,
  retryDelayMs = 0
): Promise<T> {
  let i = 0;
  let lastError;

  do {
    lastError = null;

    try {
      return isPromise(fn) ? await fn() : fn();
    } catch (error) {
      lastError = error;
    }

    await sleep(retryDelayMs);

    i++;
  } while (lastError && i < maxAttempts);

  throw lastError;
}
