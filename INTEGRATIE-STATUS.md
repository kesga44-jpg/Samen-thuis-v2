# Integratie- en API-status Samen Thuis

Deze build is gebaseerd op de aangeleverde hoofdrepository. De bestaande app-code en vormgeving zijn behouden; dit document legt de aangetroffen integraties en verificatie vast.

## Aangetroffen externe integraties

- **Weer:** Open-Meteo Forecast API (`https://api.open-meteo.com/v1/forecast`). Dashboard haalt actuele waarden, uurverwachting en meerdaagse waarden op en bewaart cache in `localStorage`.
- **Luchtkwaliteit en pollen:** Open-Meteo Air Quality API (`https://air-quality-api.open-meteo.com/v1/air-quality`). Dashboard toont AQI, fijnstof en pollen, met cache en foutmelding.
- **Kenteken/voertuiggegevens:** RDW Open Data (`https://opendata.rdw.nl/resource/m9d7-ebf2.json`). Voertuigscherm kan gegevens ophalen op basis van een kenteken; tankbeurten, voertuiggegevens en statistieken worden lokaal bijgehouden.
- **Synchronisatie:** Supabase REST API via de bestaande project-URL en publishable key. Synchronisatie gebruikt encryptie en conflictcontrole in de bestaande code. Configureer de bijbehorende huishoudcode/instellingen in de app.
- **PDF-import:** PDF.js via jsDelivr CDN.

## Bestaande onderdelen

De hoofdrepository bevat onder meer Vandaag, Agenda, Weekmenu, Boodschappen, Huishouden, Voorraad, Samen doen/Date ideeën, Woning, Reizen, Instellingen, import/synchronisatie, Budget en Auto/brandstof. Het dashboard bevat daarnaast weer-, luchtkwaliteit- en pollenweergave.

## Verificatie uitgevoerd

- `node --check app.js`: geslaagd.
- `node --test tests/data-core.test.js`: 8 tests geslaagd.

## Grenzen van deze controle

De tests zijn lokaal uitgevoerd zonder browser en zonder live API-aanroepen. Daarom is niet bevestigd dat externe API's op dit moment bereikbaar zijn of dat een Supabase-project correct is geconfigureerd. RDW Open Data en Open-Meteo gebruiken in de aangetroffen code publieke endpoints; er zijn geen API-sleutels voor deze diensten nodig in de client. Supabase-configuratie en toegangsregels moeten in de eigen omgeving blijven kloppen.
