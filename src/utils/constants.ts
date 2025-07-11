import { State } from "../models/state.js";

export const INITIAL_STATE: State = {
  movies: [],
  unsuccessSearches: [],
  blacklist: [],
};

export const CATEGORY_NAME = "TMDB2qb";
export const CATEGORY_DIR = "/mnt/HDD1/In download";

export const LIBRARIES = [
  { regex: /^./, dir: "/mnt/HDD1/Film" },
  // { regex: /^[n-z]/i, dir: "/mnt/HDD2/Film (N-Z)" },
  // { regex: /^./, dir: "/mnt/HDD1/Film (0-M)" },
];

export const MOVIES_TO_FETCH = 1000;

export const MIN_DAYS_PASSED_SINCE_RELEASE = 30;
export const SEARCH_RETRY_INTERVAL_IN_DAYS = 30;
export const MAX_DAYS_TO_COMPLETE_DOWNLOAD = 30;

export const MIN_FILE_SIZE_RUNTIME_COEF = 2;
export const MAX_FILE_SIZE_RUNTIME_COEF = 100;

export const TITLE_ALT_WHITESPACES = ["_", ".", "-"];

export const RES_2160_REGEXS = [/([ _.([-]+|^)(2160p?|4k)([ _.)\]-]+|$)/];
export const RES_1080_REGEXS = [
  /([ _.([-]+|^)1080p?([ _.)\]-]+|$)/,
  /([ _.([-]+|^)(f|full)[ _.-]*hd([ _.)\]-]+|$)/,
];
export const RES_720_REGEXS = [/([ _.([-]+|^)(720p?|hd)([ _.)\]-]+|$)/];
export const UPSCALED_REGEXS = [
  /([ _.([-]+|^)(up[ _.-]*)?scaled?([ _.)\]-]+|$)/,
];
export const EXTENDED_REGEXS = [
  /([ _.([-]+|^)extended([ _.-]*cut)?([ _.)\]-]+|$)/,
  /([ _.([-]+|^)(esteso|estesa)([ _.)\]-]+|$)/,
  /([ _.([-]+|^)director'?s?[ _.-]*cut([ _.)\]-]+|$)/,
];
export const DV_REGEXS = [
  /([ _.([-]+|^)(d|dolby)[ _.-]*(v|vision)([ _.)\]-]+|$)/,
];
export const HDR10P_REGEXS = [
  /([ _.([-]+|^)(h|hdr)[ _.-]*10[ _.-]*(p|plus|\+)([ _.)\]-]+|$)/,
];
export const HDR10_REGEXS = [/([ _.([-]+|^)(h|hdr)[ _.-]*10([ _.)\]-]+|$)/];
export const HDR_REGEXS = [/([ _.([-]+|^)hdr([ _.)\]-]+|$)/];
export const TEN_BIT_REGEXS = [/([ _.([-]+|^)10[ _.-]*bits?([ _.)\]-]+|$)/];
export const AUD_7_1_REGEXS = [/([ _.([-]+|^)7[ _.-]+1([ _.)\]-]+|$)/];
export const AUD_5_1_REGEXS = [/([ _.([-]+|^)5[ _.-]+1([ _.)\]-]+|$)/];
export const AUD_2_1_REGEXS = [/([ _.([-]+|^)2[ _.-]+1([ _.)\]-]+|$)/];
export const AUD_2_0_REGEXS = [/([ _.([-]+|^)2[ _.-]+0([ _.)\]-]+|$)/];
export const LOSSLESS_AUD_REGEXS = [/([ _.([-]+|^)flac([ _.)\]-]+|$)/];
export const BEST_LOSSY_AUD_REGEXS = [
  /([ _.([-]+|^)(e|enhanced)[ _.-]*ac[ _.-]*3([ _.)\]-]+|$)/,
  /([ _.([-]+|^)(d|dolby)[ _.-]*(d|digital)[ _.-]*(p|plus|\+)([ _.)\]-]+|$)/,
  /([ _.([-]+|^)dts[ _.-]*hd([ _.)\]-]+|$)/,
];
export const GOOD_LOSSY_AUD_REGEXS = [
  /([ _.([-]+|^)ac[ _.-]*3([ _.)\]-]+|$)/,
  /([ _.([-]+|^)(d|dolby)[ _.-]*(d|digital)([ _.)\]-]+|$)/,
  /([ _.([-]+|^)dts([ _.)\]-]+|$)/,
  /([ _.([-]+|^)aac([ _.)\]-]+|$)/,
];
export const REMASTERED_REGEXS = [
  /([ _.([-]+|^)remastered([ _.)\]-]+|$)/,
  /([ _.([-]+|^)(rimasterizzato|rimasterizzata)([ _.)\]-]+|$)/,
  /([ _.([-]+|^)(restaurato|restaurata)([ _.)\]-]+|$)/,
];
export const BEST_RIPPER_REGEXS = [
  /([ _.([-]+|^)licdom([ _.)\]-]+|$)/,
  /([ _.([-]+|^)sp33dy94[ _.()[\]-]*mircrew([ _.)\]-]+|$)/,
  /([ _.([-]+|^)aspide[ _.()[\]-]*mircrew([ _.)\]-]+|$)/,
  /([ _.([-]+|^)snakespl[ _.()[\]-]*mircrew([ _.)\]-]+|$)/,
  /([ _.([-]+|^)jeddak[ _.()[\]-]*mircrew([ _.)\]-]+|$)/,
  /([ _.([-]+|^)dr4gon[ _.()[\]-]*mircrew([ _.)\]-]+|$)/,
];
export const GOOD_RIPPER_REGEXS = [/([ _.([-]+|^)mircrew([ _.)\]-]+|$)/];
export const REPACKED_REGEXS = [
  /([ _.([-]+|^)re[ _.-]*pack(ed)?([ _.)\]-]+|$)/,
];

export const VIRUS_REGEXS = [
  /([ _.([-]+|^)(exe|msi|bat|dmg|sh|jar)([ _.)\]-]+|$)/,
];

export const HIGH_QUALITY_THRESHOLD = 2.5e9;

export const OFFICIAL_PLUGINS_REPO =
  "https://github.com/qbittorrent/search-plugins/wiki/Unofficial-search-plugins";
export const LIGHT_DESTORY_PLUGINS_REPO =
  "https://github.com/LightDestory/qBittorrent-Search-Plugins";
export const BROKEN_PLUGIN_CHARS = ["❗", "✖", "❌", "Yggdrasil", "✖️", "❓"];

export const OI_CHAT_ENDPOINT = "http://localhost:8080/api/chat/completions";
export const OI_MODEL = "gemma3:12b";
