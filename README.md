# PubsNexa
Publications

    All’interno della cartella pubblications è presente uno script chiamato pubb.sh tramite il quale è possibile, dato un file json contenente le informazioni sui membri di NEXA (vedi people.json), ottenere per ognuno dei membri un file in formato json (vedi 001921.json per esempio) contenente tutte le pubblicazioni con le informazioni dettagliate.

    Affinchè i file in formato json per ogni membro siano sempre aggiornati va eseguito lo script periodicamente in modo da recuperare dal sito IRIS del politecnico tutte le ultime pubblicazioni.

    Gli script javascript che si occupano della creazione del contenuto html sono contenute nella cartella js e sono irisJsonParser.js e renderPub-1.1.0.js in particolare in quest’ultimo da riga 115 a 151 è presente il dom che si occupa della creazione del contenuto diviso per anni e poi per tipo di pubblicazione e la creazione della lista non ordinata contenente gli anni di pubblicazione e i link ai rispettivi punti della pagina html.

    L’elemento all’interno del quale verrà generato il tutto è un div all’interno del body con id=’publications’ per le pubblicazioni e div all’interno del body con id=’summary’ come si può notare rispettivamente a riga 57 e 151 di renderPub-1.1.0.js. Il file html definitivo è paper_v3.html in cui da riga 52 a 117 sono stati inseriti i collegamenti agli script javascript menzionati nel punto 2, nel file html paper.html non è invece presente la barra di navigazione verticale con gli anni.

Nota. Il file json chiamato people.json deve essere strettamente nel formato presentato altrimenti la grep del file bash fallisce
