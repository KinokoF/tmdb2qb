import { RawSearchResult } from "qbit.js";

export interface TorrentGroup {
  name: string;
  rating: number;
  torrents: RawSearchResult[];
}
