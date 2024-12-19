# Alle mot 1

## Nesten som på NRK

Med denne appen kan ein spela Alle mot 1 på private arrangement.

## Konsept

Alle brukarar av appen må autentisera seg. Kun Admin og Vert treng å vera registrert med epost. Dei andre kan logga inn som anonyme gjester. Gjester kan ha 'nickname' i databasen.

### På førehand

__Admin__ kan tildela Vert-rolle til ein brukar, identifisert med epostadresse.

__Vert__ kan

- laga nytt _spel_ og leggja til eitt eller fleire _eksperiment_ til spelet.
- finna URL og QR-kode for eit spel og dela med alle som skal vera publikum
- finna URL til ei separat resultat-side for visning på storskjerm
- leggja til ein _deltakar_ i spelet ved å leggja inn deltakaren si epostadresse

__Deltakar__ er den eine spelaren som er åleine mot dei andre.

Eit __eksperiment__ 
- er definert med ein tittel og ein forklarande tekst. Det kan leggjast til eit bilete.
- har eit gitt utfallsrom som er angitt i heiltal, frå min til maks

### Undervegs

__Vert__ startar spelet, og styrer progresjonen på kvart eksperiment

_Eksperimentet_ sin _status_ avjer kva som dukkar opp på skjermen til spelarane.

__Spelarar__ kan gjetta på kvart eksperiment når Verten opnar for det.

__Deltakar__ kan potensielt få lov til å justera si gjetting.

Når _eksperimentet_ er ferdig må verten leggja inn det faktiske _resultatet_.

På resultatsida blir det fyrst presentert deltakaren si getting, resultatet og eit område lik avstanden mellom desse, på kvar side av resultatet. Etterpå kjem publikum si gjetting. Om publikum i gjennomsnitt gjettar innanfor dette området, altså nærare resultatet enn deltakaren, vinn publikum. Om publikum si gjetting fell utanfor vinn deltakaren.

På sin eigen skjerm får deltakarane sjå kva dei har gjetta sjølv, på den same skalaen.

# Teknisk

## Prosjektet er bygd på Vite, Preact og Firebase

For å bruka denne koden mot firebase må ein oppretta prosjekt i Firebase Console med ein database som heiter 'allemot1-db' og laga ei .env fil i root-mappa (her som  README.md ligg) med dei nødvendige verdiane.

-   `npm run dev` - Starts a dev server at http://localhost:5173/

-   `npm run build` - Builds for production, emitting to `dist/`

-   `npm run preview` - Starts a server at http://localhost:4173/ to test production build locally
    

Den initielle versjonen blei laga med mykje hjelp frå Claude AI, som ein test på kva ein kan få AI til å generera av kode.

Erfaringa er at det fungerte ganske bra, men at ein del slurvefeil (frå Claude si side) tok mykje tid å feilsøkja.


I skrivande stund køyrer ein instans av appen på

https://allemotein.web.app/

men det er ingen garanti for kapasitet og levetid på denne


Appen har blitt brukt med rundt 100 aktive spelarar


Pull Request er velkomne :)