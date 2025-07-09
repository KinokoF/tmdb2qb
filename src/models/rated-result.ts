import { RawSearchResult } from "qbit.js";

export interface RatedResult extends RawSearchResult {
  rating: number;
}
