# TMDB2qb
The Movie Database to qBittorrent

## Premise
Torrent files might carry copyrighted content. Make sure you NEVER violate your country's laws.

## What is it?
A console application written in TypeScript that automates the download of movies and miniseries.

## How does it work?
The application follows these steps:
- Retrieves the best movies and miniseries, in order of rating, via the TMDB APIs
- Updates qBittorrent plugins (uninstalling existing ones and installing all those listed in the two pre-configured repositories)
- Processes each movie/miniseries:
  - Searching, evaluating, and downloading items not yet downloaded
  - Deleting long-stalled downloads and attempting a new search
- Waits a while, then restarts from the first step

## Installation

### 1. Install and configure qBittorrent
Install the latest version of qBittorrent, then apply the following configurations:
- Downloads -> Check "Do not start the download automatically"
- Downloads -> Select "Automatic" in the "Default Torrent Management Mode" field
- WebUI -> Check "Web User Interface (Remote control)"
- WebUI -> Enter a password in the "Password" field
- WebUI -> Enter 999999 in the "Session timeout" field (arbitrarily high value)

### 2. Install Node.js and Git
Install the latest versions of Node.js and Git.

### 3. Install/use Open WebUI
For configuration, an Open WebUI token is required; feel free to choose whether to:
- Install Open WebUI and pair it with Ollama
- Install Open WebUI and use it as a proxy for any AI
- Use an existing Open WebUI installation

### 4. Download the project
Navigate to your desired folder and execute:
```bash
git clone https://github.com/KinokoF/tmdb2qb.git
```

## Configuration

### 1. secret.ts file
Create the `utils/secret.ts` file with the following content:
```ts
export const QB_USER = "<qBittorrent username>";
export const QB_PASS = "<qBittorrent password>";

export const TMDB_TOKEN = "<TMDB API key>";

export const OI_TOKEN = "<Open WebUI API key>";
```

### 2. constants.ts file
Modify the `utils/constants.ts` file to suit your needs. Here you can, for example, customize:
```ts
// Folder to download files to
export const CATEGORY_DIR = "/mnt/HDD1/In download";

// Folders to move completed files to
// (use regex to sort files based on their name)
export const LIBRARIES = [
  { type: "movie", regex: /^[n-z]/i, dir: "/mnt/HDD2/Film (N-Z)" },
  { type: "movie", regex: /^./, dir: "/mnt/HDD1/Film (0-M)" },
  { type: "tv", regex: /^./, dir: "/mnt/HDD2/Miniserie" },
];

// Number of movies and miniseries to fetch
export const MOVIES_TO_FETCH = 1000;
export const TVS_TO_FETCH = 100;

// Minimum number of days passed since the release date
export const MIN_DAYS_PASSED_SINCE_RELEASE = 30;

// Number of days after which to retry a failed search
export const SEARCH_RETRY_INTERVAL_IN_DAYS = 30;

// Number of days available to complete the download
export const MAX_DAYS_TO_COMPLETE_DOWNLOAD = 30;

// Coefficients to multiply by duration to determine minimum and maximum file size in MB
export const MIN_FILE_SIZE_RUNTIME_COEF = 2;
export const MAX_FILE_SIZE_RUNTIME_COEF = 100;

// In which language do you want to download the content?
export const LANG = "it";

// A country where that language is widely spoken
export const COUNTRY = "IT";

// Additional countries for extracting alternative titles and release dates
// (the more you add, the slower and more accurate the search will be)
export const ADDITIONAL_COUNTRIES = ["US", "GB"];

// Optional nice-to-have additional languages (max 4)
// (specify $ORIGINAL$ for the content's original language)
export const OPTIONAL_LANGS = ["$ORIGINAL$", "en"];

// Don't forget to review and expand the regexes to better support your language!

// ...and much more!
```

## Startup
Execute the following commands:
```bash
cd tmdb2qb
npm run build
npm run start:prod
```

## Input parameters
Customize execution by specifying the following arguments:
- `add-movies=123,456`: Forcefully adds TMDB IDs (comma-separated) to those to be processed
- `add-tvs=789`: Forcefully adds TMDB IDs (comma-separated) to those to be processed
- `no-scan`: Deactivates both TMDB scans
  - `no-scan-movies`: Deactivates TMDB movie scan
  - `no-scan-tvs`: Deactivates TMDB miniseries scan
- `no-upd-plugins`: Deactivates plugin update
- `no-process`: Deactivates movie/miniseries processing
- `no-loop`: Deactivates the loop

## Cleanup
If you want to start from scratch, you can:
- Remove all torrents, the `TMDB2qb` category, and all labels from qBittorrent
- Delete the `state.json` file (inside the `tmdb2qb` folder)
- Delete the downloaded files

## TODO
Things to implement (sooner or later):
- Move configuration to a `config.json` file

## Friend software
Software that might be useful:
- Jellyfin
