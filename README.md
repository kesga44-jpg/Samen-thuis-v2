# Samen Thuis — vNext

Deze map bevat exact de 7 hoofdbestanden van de app:

1. `index.html`
2. `app.js`
3. `styles.css`
4. `sw.js`
5. `manifest.webmanifest`
6. `icon.svg`
7. `README.md`

## Belangrijk
- De app blijft `samenThuisDataV2` gebruiken.
- Migratie behoudt onbekende bestaande datavelden.
- Maak vóór vervanging altijd een JSON-back-up vanuit de huidige app.
- Wis geen browser-/websitegegevens tijdens de update.
- Upload alle 7 bestanden in één commit naar de GitHub Pages branch.
- Sluit daarna de geïnstalleerde PWA volledig en open de website één keer opnieuw.

## Nieuwe onderdelen
- Universele Taken-pagina voor eenmalige en terugkerende taken.
- Uitdagingen voor Kees, Daphne, samen of tegen elkaar.
- Meettypen: aantal, afstand, tijd, streak, ja/nee en bedrag.
- XP/puntenregels en inwisselbare beloningen.
- Challenge-progressie op Today.
- Slimmere Today met agenda, taken, huishouden, woning, reizen en voorraad.
- Snel toevoegen vanuit iedere pagina.
- Lage voorraad automatisch naar boodschappen.
- Persoonlijke taakverdeling.
- Woningonderhoud en reisdeadlines zichtbaar op Today.
- Light/dark kleurcontract: lichte kaarten houden donkere tekst.

## Datamodel vNext
Nieuwe velden:
- `tasks`
- `challenges`
- `challengeEntries`
- `pointsLedger`
- `rewards`
- `pointRules`
- `settingsVNext`

Alle velden worden meegenomen in lokale back-up. Omdat de volledige appdata als één object wordt opgeslagen, kunnen ze ook met een bestaande volledige-data synchronisatielaag worden meegestuurd.

## Testlijst
1. Open de app eerst met bestaande data.
2. Controleer Agenda, Boodschappen, Huishouden, Voorraad, Reizen en Woning.
3. Maak een nieuwe taak en vink hem af.
4. Maak een challenge en voeg voortgang toe.
5. Controleer punten en een beloning.
6. Verlaag voorraad tot minimum en controleer Boodschappen.
7. Test light/dark mode.
8. Maak een back-up, herlaad die en controleer de nieuwe onderdelen.
9. Test offline na één online laadbeurt.

## Opmerking over bestaande modules
De vNext-migratie verwijdert bestaande onbekende objecten (waaronder oudere budget- en synchronisatievelden) niet. De kernopzet is bewust data-veilig gehouden zodat uitbreiding niet stilzwijgend data weggooit.
