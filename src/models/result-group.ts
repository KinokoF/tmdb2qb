import { RatedResult } from "./rated-result.js";

export interface ResultGroup {
  name: string;
  rating: number;
  results: RatedResult[];
}
