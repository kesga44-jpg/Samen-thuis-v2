# Samen Thuis — nieuwe map met updates

Deze map verzamelt de teruggevonden v16-update en de eerder gemaakte v26-challenges-update, samen met de beschikbare styling- en PWA-bestanden.

## Bestanden

- `samen-thuis-update-v16.js` — slimme, flexibele huishoudplanning uit v16; houdt rekening met daadwerkelijke uitvoeringsmomenten in plaats van vaste weekdagen.
- `samen-thuis-update-v26-challenges.js` — aanvullende gamification/challenges-code uit de eerdere update.
- `LEESMIJ-v26-challenges.md` — notities bij de challenges-update.
- `styles-2026-09-18.css` — beschikbare stylesheet uit de aangeleverde projectbestanden.
- `manifest.webmanifest` en `icon.svg` — beschikbare PWA-metadata en app-icoon.

## Belangrijk: dit is nog geen complete, zelfstandig draaiende app

De volledige v25-app-zip staat in de eerdere projectbestanden, maar kon in deze werkomgeving niet als ruwe bestanden worden geopend. Daarom is `index.html` en de hoofd-`app.js` niet opgenomen of aangepast. Ik heb niet gedaan alsof Supabase al verwijderd is of alsof deze map direct zonder integratie kan worden gepubliceerd.

## Integratievolgorde zodra de volledige app-bron beschikbaar is

1. Begin met de volledige werkende app-versie die v16 al bevat of laad v16 één keer in de bestaande scriptvolgorde.
2. Controleer de v16-huishoudplanning op de huidige datamodellen en bestaande functies.
3. Integreer de challenges als een algemene app-functie (niet alleen voor huishouden): persoonlijke uitdagingen, dagelijkse afvinkmomenten, streaks, punten, challenges voor elkaar en inwisselbare beloningen.
4. Behoud bestaande modules en functionaliteit; voer geen destructieve datamigratie uit.
5. Verwijder Supabase pas zorgvuldig uit de volledige hoofdcode en controleer dat alle gegevens lokaal blijven via de bestaande lokale opslag.
6. Test navigatie, opslaan/herladen, bestaande huishoudtaken, challenges, punten en beloningen voordat je de map naar een GitHub-branch kopieert.

## Wat nog nodig is voor een complete branch-ready release

De volledige project-zip of minimaal de actuele `index.html`, hoofd-`app.js`, service worker en eventuele updatebestanden. Met alleen de updatebestanden kan ik niet veilig alle bestaande functies behouden of de Supabase-afhankelijkheden volledig verwijderen.
