# Samen Thuis v23.0

Build: 2026-09-17 07:16:46 +0000

## Structuur
De repository heeft alleen deze zeven bestanden nodig: `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `icon.svg` en `README.md`. Er zijn geen losse versie-updatebestanden nodig.

## Navigatie
Desktop behoudt de bestaande navigatie. Mobiel gebruikt één vaste glazen balk met alle 12 pagina's in één horizontaal swipebare lijst. De actieve pagina schuift automatisch in beeld.

## Thema
De app gebruikt één systeemlettertype. Lichte/witte oppervlakken houden in light én dark dezelfde donkere primaire en secundaire tekst. Donkere oppervlakken volgen het actieve thema. Accentonderdelen en grafieken volgen de gekozen accentkleur.

## Budget
Budget v23 gebruikt één centrale berekening voor:
- netto inkomen Kees en Daphne;
- gezamenlijke afdracht en persoonlijk resterend;
- vaste lasten met maand/kwartaal/jaar-omrekening;
- huisbudget en subcategorieën;
- spaardoelen en maandelijkse inleg;
- beleggen;
- benodigd afdrachtpercentage;
- maandelijks overschot/tekort.

Standaardwaarden: Kees €2.731 netto, Daphne €3.427 netto, 75% afdracht, €1.000 huisbudget en €75 beleggen per maand. Spaardoelen: Buffer €3.000 (start €1.000), Vakantie €5.000/jaar, Huis €15.000 eind 2027 en Overig €10.000.

### Grafieken
Ieder spaardoel heeft een voortgangsring en een prognoselijn. Daarnaast toont Budget een vergelijking van gespaard versus nog nodig en een maandelijkse geldverdeling. Grafieken worden uit dezelfde centrale berekening opgebouwd als de KPI's.

## Opslag
De bestaande opslag- en synchronisatiearchitectuur blijft behouden. `budgetV23` wordt backward-compatible aan de bestaande data toegevoegd. De migratie bewaart ook oudere budgetvelden in plaats van deze bij het laden weg te gooien.

## Uitbreiden
Voeg nieuwe functionaliteit bij voorkeur toe aan de bestaande render-, event- en datalaag. Maak geen nieuwe `vXX` wrapper onderaan het bestand als dezelfde functie structureel kan worden uitgebreid.

## Cache
GitHub Pages gebruikt cache `samen-thuis-v23-integrated-budget-nav` en assetversie `v230`.
