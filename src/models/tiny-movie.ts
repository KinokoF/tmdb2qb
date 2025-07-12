export type TinyMovieType = "movie" | "tv";

export interface TinyMovie {
  type: TinyMovieType;
  id: number;
  title: string;
  originalLang: string;
  year: number;
  runtime: number;
  altTitles: string[];
  altYears: number[];
}
