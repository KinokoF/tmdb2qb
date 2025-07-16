# TMDB2qb
The Movie Database to qBittorrent

## Premessa
I file torrent potrebbero veicolare contenuti protetti da copyright. Assicurati di NON violare MAI le leggi del tuo paese.

## Cosa è?
Un applicativo console scritto in TypeScript che automatizza il download di film e miniserie.

## Come funziona?
L'applicativo segue i seguenti passi:
- Recupera i migliori film e miniserie, in ordine di voto, tramite le API di TMDB
- Aggiorna i plugin di qBittorrent (disinstallando quelli preesistenti e installando tutti quelli listati nei due repository preconfigurati)
- Elabora ogni film/miniserie:
  - Ricercando, valutando e scaricando gli elementi non ancora scaricati
  - Eliminando i download in stallo da molto tempo e tentando una nuova ricerca
- Aspetta un po', quindi riparte dal primo passo

## Installazione

### 1. Installa e configura qBittorrent
Installa l'ultima versione di qBittorrent, quindi applica le seguenti configurazioni:
- Download -> Spuntare "Non avviare il download automaticamente"
- Download -> Selezionare "Automatica" nel campo "Modalità gestione torrent predefinita"
- WebUI -> Spuntare "Interfaccia utente web (controllo remoto)"
- WebUI -> Inserire una password nel campo "Password"
- WebUI -> Inserire 999999 nel campo "Timeout sessione" (valore arbitrariamente alto)

### 2. Installa Node.js e Git
Installa le ultime versioni di Node.js e Git

### 3. Installa/utilizza Open WebUI
Per la configurazione occorre un token Open WebUI, scegli liberamente se:
- Installare Open WebUI e affiancarlo a Ollama
- Installare Open WebUI e usarlo come tramite per una qualsiasi AI
- Usare una installazione Open WebUI preesistente

### 4. Scarica il progetto
Posizionati nella cartella desiderata ed esegui:
```bash
git clone https://github.com/KinokoF/tmdb2qb.git
```

## Configurazione

### 1. File secret.ts
Crea il file `utils/secret.ts` con il seguente contenuto:
```ts
export const QB_USER = "<username di qBittorrent>";
export const QB_PASS = "<password di qBittorrent>";

export const TMDB_TOKEN = "<chiave API di TMDB>";

export const OI_TOKEN = "<chiave API di Open WebUI>";
```

### 2. File constants.ts
Modifica il file `utils/constants.ts` adattandolo alle tue esigenze. Qui puoi, per esempio, personalizzare:
```ts
// Cartella nella quale scaricare i file
export const CATEGORY_DIR = "/mnt/HDD1/In download";

// Cartelle dove spostare i file completati
// (il nome del file dovrà matchare la regex)
export const LIBRARIES = [
  { type: "movie", regex: /^[n-z]/i, dir: "/mnt/HDD2/Film (N-Z)" },
  { type: "movie", regex: /^./, dir: "/mnt/HDD1/Film (0-M)" },
  { type: "tv", regex: /^./, dir: "/mnt/HDD2/Miniserie" },
];

// Numero di film e miniserie da scaricare
export const MOVIES_TO_FETCH = 1000;
export const TVS_TO_FETCH = 100;

// Numero di giorni minimi trascorsi dalla data di uscita
export const MIN_DAYS_PASSED_SINCE_RELEASE = 30;

// Numero di giorni dopo i quali riprovare una ricerca fallita
export const SEARCH_RETRY_INTERVAL_IN_DAYS = 30;

// Numero di giorni a disposizione per completare il download
export const MAX_DAYS_TO_COMPLETE_DOWNLOAD = 30;

// Coefficenti da moltiplicare alla durata per determinare la dimensione minima e massima del file in MB
export const MIN_FILE_SIZE_RUNTIME_COEF = 2;
export const MAX_FILE_SIZE_RUNTIME_COEF = 100;

// ...e tanto altro!
```

## Avvio
Esegui i seguenti comandi:
```bash
cd tmdb2qb
npm run build
npm run start:prod
```

## Parametri in input
Personalizza l'esecuzione specificando i seguenti argomenti:
- `add-movies=123,456`: Aggiunge forzatamente gli id TMDB (separati da virgola) a quelli da elaborare
- `add-tvs=789,012`: Aggiunge forzatamente gli id TMDB (separati da virgola) a quelli da elaborare
- `no-scan`: Disattiva entrambe le scansioni
  - `no-scan-movies`: Disattiva la scansione dei film
  - `no-scan-tvs`: Disattiva la scansione delle miniserie
- `no-upd-plugins`: Disattiva l'update dei plugin
- `no-process`: Disattiva l'elaborazione dei film/miniserie
- `no-loop`: Disattiva il loop

## Pulizia
Se vuoi ripartire da zero puoi:
- Rimuovere tutti i torrent, la categoria `TMDB2qb` e tutte le etichette da qBittorrent
- Elimina il file `state.json` (dentro la cartella `tmdb2qb`)
- Elimina i file scaricati

## TODO
Cose da implementare (prima o poi):
- Spostare la configurazione in un file `config.json`
- Parametrizzare la lingua primaria e secondaria (attualmente sono hardcodate)
