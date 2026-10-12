# Integratie- en API-status Samen Thuis

De primaire applicatie blijft leidend: de aanvullende repository gebruikt ES-modules, terwijl de hoofdapp een klassieke JavaScript-entrypoint met bestaande lokale opslag en synchronisatie gebruikt. De aanvullende functies zijn daarom in de bestaande appstructuur aangesloten; bestaande pagina's, gegevens en vormgeving blijven behouden.

## Aangetroffen externe integraties

- **Weer:** Open-Meteo Forecast API (`https://api.open-meteo.com/v1/forecast`). Dashboard haalt actuele waarden, uurverwachting en meerdaagse waarden op en bewaart cache in `localStorage`.
- **Weerpagina:** Zevendaagse en uurlijkse verwachting met temperatuur/neerslaggrafieken, locatie-invoer en browserlocatie. De bestaande dashboardweergave gebruikt dezelfde opgeslagen locatie.
- **Luchtkwaliteit en pollen:** Open-Meteo Air Quality API (`https://air-quality-api.open-meteo.com/v1/air-quality`). Dashboard toont AQI, fijnstof en pollen, met cache en foutmelding.
- **Kenteken/voertuiggegevens:** RDW Open Data (`https://opendata.rdw.nl/resource/m9d7-ebf2.json`). Voertuigscherm kan gegevens ophalen op basis van een kenteken; tankbeurten, voertuiggegevens en statistieken worden lokaal bijgehouden.
- **Synchronisatie:** Supabase REST API via de bestaande project-URL en publishable key. Synchronisatie gebruikt encryptie en conflictcontrole in de bestaande code. Configureer de bijbehorende huishoudcode/instellingen in de app.
- **PDF-import:** PDF.js via jsDelivr CDN.

## Bestaande onderdelen

De hoofdrepository bevat onder meer Vandaag, Agenda, Weekmenu, Boodschappen, Huishouden, Voorraad, Samen doen/Date ideeën, Woning, Reizen, Instellingen, import/synchronisatie, Budget en Auto/brandstof. Dashboardkaarten kunnen per apparaat worden verborgen en geordend via Instellingen. De aanvullende repository biedt ook taken-, challenge- en programmafuncties; deze zijn geen nieuwe afzonderlijke pagina's in deze integratie, omdat de primaire app gegevens voor huishoudtaken en samen-doen al op haar eigen manier beheert.

## Verificatie uitgevoerd

- `node --check app.js`: geslaagd.
- `node --test data-core.test.js`: kon niet starten; het bestaande testbestand vereist `../data-core.js`, terwijl de module in de repositoryroot staat.

## Grenzen van deze controle

De syntaxiscontrole is lokaal uitgevoerd zonder browser en zonder live API-aanroepen. De bestaande unit-test kon door het onjuiste relatieve require-pad niet draaien. Daarom is niet bevestigd dat externe API's op dit moment bereikbaar zijn, dat browsergeolocatie beschikbaar is of dat een Supabase-project correct is geconfigureerd. RDW Open Data en Open-Meteo gebruiken publieke endpoints; er zijn geen API-sleutels voor deze diensten nodig in de client. Supabase-configuratie en toegangsregels moeten in de eigen omgeving blijven kloppen.
