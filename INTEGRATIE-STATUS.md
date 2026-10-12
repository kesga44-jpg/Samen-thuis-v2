# Integratie- en API-status Samen Thuis

De primaire applicatie blijft leidend: de aanvullende repository gebruikt ES-modules, terwijl de hoofdapp een klassieke JavaScript-entrypoint met bestaande lokale opslag en synchronisatie gebruikt. De aanvullende functies zijn daarom in de bestaande appstructuur aangesloten; bestaande pagina's, gegevens en vormgeving blijven behouden.

## Aangetroffen externe integraties

- **Weer:** Open-Meteo Forecast API (`https://api.open-meteo.com/v1/forecast`). Dashboard haalt actuele waarden, uurverwachting en meerdaagse waarden op en bewaart cache in `localStorage`.
- **Weerpagina:** Zevendaagse en uurlijkse verwachting met temperatuur/neerslaggrafieken, locatie-invoer en browserlocatie. De bestaande dashboardweergave gebruikt dezelfde opgeslagen locatie.
- **Luchtkwaliteit en pollen:** Open-Meteo Air Quality API (`https://air-quality-api.open-meteo.com/v1/air-quality`). Dashboard toont AQI, fijnstof en pollen, met cache en foutmelding.
- **Kenteken/voertuiggegevens:** RDW Open Data (`https://opendata.rdw.nl/resource/m9d7-ebf2.json`). Voertuigscherm kan gegevens ophalen op basis van een kenteken; tankbeurten, voertuiggegevens en statistieken worden lokaal bijgehouden.
- **Synchronisatie:** Supabase REST API via de bestaande project-URL en publishable key. Synchronisatie gebruikt encryptie en conflictcontrole in de bestaande code. Configureer de bijbehorende huishoudcode/instellingen in de app.
- **Challenges en beloningen:** De bestaande challenge-uitbreiding is aangesloten op de primaire navigatie en de hoofdgegevensstructuur. Punten en voortgang gaan daardoor mee in de bestaande JSON-back-up en versleutelde synchronisatie.
- **PDF-import:** PDF.js via jsDelivr CDN.

## Bestaande onderdelen

De hoofdrepository bevat onder meer Vandaag, Agenda, Weekmenu, Boodschappen, Taken, Huishouden, Challenges, Programma's, Voorraad, Samen doen/Date ideeën, Woning, Reizen, Instellingen, import/synchronisatie, Budget en Auto/brandstof. Dashboardkaarten kunnen per apparaat worden verborgen en geordend via Instellingen. De primaire huishoudplanning en ideeën blijven behouden; acties en prijsvolging blijven onder de bestaande boodschappen-/auto-onderdelen.

## Verificatie uitgevoerd

- `node --check app.js`: geslaagd.
- `node --test data-core.test.js household-core.test.js`: geslaagd (22 tests); het relatieve require-pad van data-core.test.js is hersteld.

## Grenzen van deze controle

De syntaxiscontrole is lokaal uitgevoerd zonder browser en zonder live API-aanroepen. De bestaande unit-test kon door het onjuiste relatieve require-pad niet draaien. Daarom is niet bevestigd dat externe API's op dit moment bereikbaar zijn, dat browsergeolocatie beschikbaar is of dat een Supabase-project correct is geconfigureerd. RDW Open Data en Open-Meteo gebruiken publieke endpoints; er zijn geen API-sleutels voor deze diensten nodig in de client. Supabase-configuratie en toegangsregels moeten in de eigen omgeving blijven kloppen.

## Uitbreiding: aanbiedingen, accentkleur, quotes en sparen (status)

### Geïmplementeerd
- **Accentkleur:** vrije kleurkiezer (zoals `A-Samen-Thuis-Test`: `input[type=color]` + CSS-variabelen) in Instellingen. `SamenThuisHousehold.deriveAccent` leidt `--blue`, `--blue-soft`, hover, tekstkleur op accent, focusring en een lichte variant voor donkere achtergronden af, met minimaal 4,5:1 contrast. Toegepast op primaire knoppen, actieve navigatie, focusindicatoren en formulierelementen (`accent-color`). Oude presets worden als startwaarde gemigreerd. Bestaande hardgecodeerde glass-accenten in `styles.css` zijn niet allemaal vervangen. Niet in een browser getest.
- **Persoonlijk per apparaat:** de app heeft **geen accounts**; Kees/Daphne zijn alleen namen in de data. Daarom is er een profielkeuze per apparaat; de accentkleur wordt per profiel in `localStorage` bewaard, niet gesynchroniseerd en niet in de gedeelde data gezet. Betrouwbare accountspecifieke synchronisatie vereist Supabase Auth (één gebruiker per persoon) met een tabel `user_preferences` onder RLS op `auth.uid()`; dat is bewust niet nagebootst.
- **Quotes:** titel "Quote of the day" verwijderd, auteur direct onder de quote, rotatie elke 90 s met rustige fade. Alleen quotes mét auteur uit de bestaande BrainyQuote-feed komen in een lokale pool; er zijn geen quotes verzonnen. Zolang de pool leeg is (bijv. feed niet bereikbaar) wordt een melding getoond.
- **Rekenkern (`household-core.js`, getest):** spaardoelen (inleg per week/2 weken/maand/kwartaal/jaar op kalenderdata, gepland vs. werkelijk, achterstand, verwachte einddatum, pauze/bereikt/verlopen, bankstand apart), stortingen met validatie en deduplicatie, budgetverdeling op prioriteit/deadline met uitleg, aanbiedingsstatus (actief/aankomend/onbekende geldigheid/verlopen, Europe/Amsterdam, einde van de einddag), deduplicatie over bronnen, archief, normalisatie van PrijsProfeet-velden en prijs-per-eenheidsvergelijking.

### Nog niet gebouwd (alleen rekenkern, geen UI)
- Aanbiedingenpagina, favorieten/bekeken/gekocht, slimme boodschappenlijst, bespaaroverzicht.
- UI en opslag voor potjes/stortingen en budgetverdeling (bestaande `budget23`-spaardoelen zijn ongewijzigd).
- Dashboardeditor met widgets en volgorde per gebruiker (bestaande kaartenvolgorde per apparaat blijft).
- Servergestuurde verversing van aanbiedingen (vereist geplande Supabase-functie of cron).

### Externe bronnen
- **PrijsProfeet** (https://github.com/PrijsProfeet/supermarkt-api, OpenAPI): REST; zoeken/producten/aanbiedingen zonder key (120/min zoeken, 30/min bulk; gratis key 150/min; data indicatief, controleer prijzen bij de keten; API-voorwaarden gelden). Velden o.a. `price`, `original_price`, `valid_from`, `valid_until`, `valid_until_estimated`, `ean`, `image_url`, `unit_price`, `promotion_status`. Prijsgeschiedenis, EAN-matching en schapprijzen vereisen een betaalde key. Live aanroepen vanuit deze omgeving gaven geen respons, dus werking is niet live bevestigd. De bestaande edge function `supabase/functions/grocery-prices` gebruikt het zoekendpoint en leest `PRIJS_PROFEET_API_KEY` uit de serveromgeving; sleutels horen nooit in de frontend. Gebruik een herkenbare User-Agent zonder "bot"/"crawler".
- **Pepper (nl.pepper.com):** geen officiële publieke API gevonden. Niet geïntegreerd; toegestane alternatieven zijn officiële deeplinks en handmatig toevoegen/importeren. Voorwaarden voor eventuele RSS-feeds moeten eerst worden gecontroleerd.
