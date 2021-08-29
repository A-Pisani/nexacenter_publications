# Nexa Publications

This Repository is meant to summarize the work done during my Bachelor Internship for [Nexa Center for Internet & Society](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwia3r6kwNbyAhWH3YUKHRBEBYEQjBAwAnoECA8QAQ&url=https%3A%2F%2Fnexa.polito.it%2Fabout&usg=AOvVaw3lkQsYiKXJpdW32W0ffISx).

## English Version
1. Folder `pubblications` contains the script `pubb.sh` which allows to - given a `json` file containing the informations about NEXA members (see `people.json`*) - to obtain for each member a file in `json` format (E.g.: `001921.json`) containing all the information about publications for that member.

2. In order to have the `json` files up to date it is necessary to run the script periodically in order to retrieve from the [Politecnico di Torino IRIS](https://iris.polito.it/) website all the latest publications of each member.

3. The javascript scripts that handle the creation of the `html` content are inside the `js` folder. Namely `irisJsonParser.js` and `renderPub-1.1.0.js`. In particolare in the latter from line 115 to line 151 is present the `DOM` that is handling the creation of the content split for years, publication type, the unordered list of years of publication and the links to the parts of the `html` page.

4. The element inside which everything is built is:
  - a `div` inside the `body` with `id="pubblicazione"` for the publications  (line 57 of `renderPub-1.1.0.js`)
  - a `div` inside the `body` with `id="summary"` (line 151 of `renderPub-1.1.0.js`)  
  
    The final `html` file is `paper_v3.html` in which from line 52 to line 117 have been inserted the hyperlinks to the javascript files mentioned in point 2. File `paper.html` does not contain the vertical bar with years.

Note: The file `people.json` must strictly be in the presented format otherwise the `grep` command in the bash file will fail.

## Italian Version
1. All’interno della cartella pubblications è presente uno script chiamato pubb.sh tramite il quale è possibile, dato un file json contenente le informazioni sui membri di NEXA (vedi `people.json`), ottenere per ognuno dei membri un file in formato json (vedi `001921.json` per esempio) contenente tutte le pubblicazioni con le informazioni dettagliate.

2. Affinchè i file in formato json per ogni membro siano sempre aggiornati va eseguito lo script periodicamente in modo da recuperare dal sito [IRIS del politecnico](https://iris.polito.it/) tutte le ultime pubblicazioni.

3. Gli script javascript che si occupano della creazione del contenuto html sono contenute nella cartella js e sono `irisJsonParser.js` e `renderPub-1.1.0.js` in particolare in quest’ultimo da riga 115 a 151 è presente il dom che si occupa della creazione del contenuto diviso per anni e poi per tipo di pubblicazione e la creazione della lista non ordinata contenente gli anni di pubblicazione e i link ai rispettivi punti della pagina html.

4. L’elemento all’interno del quale verrà generato il tutto è un `div` all’interno del `body` con id=’publications’ per le pubblicazioni e `div` all’interno del `body` con `id=’summary’` come si può notare rispettivamente a riga 57 e 151 di `renderPub-1.1.0.js`. Il file html definitivo è `paper_v3.html` in cui da riga 52 a 117 sono stati inseriti i collegamenti agli script javascript menzionati nel punto 2, nel file html `paper.html` non è invece presente la barra di navigazione verticale con gli anni.


* Nota: Il file json chiamato `people.json` deve essere strettamente nel formato presentato altrimenti la grep del file bash fallisce
