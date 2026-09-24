# Samen Thuis β — volledige herbouw

Dit is een zelfstandige bèta-versie van Samen Thuis. De app is opnieuw opgebouwd als statische PWA zonder buildstap en kan rechtstreeks via GitHub Pages worden gepubliceerd.

## Belangrijk: veilig naast productie

Deze versie gebruikt andere sleutels en een ander sync-record dan de productie-app:

- lokale opslag: `samenThuisBetaV1`;
- synchronisatie-id: SHA-256 van `samen-thuis-beta-v1|<huishoudcode>`;
- PWA-naam: `Samen Thuis β`.

Je kunt dus dezelfde Supabase-projectgegevens en zelfs dezelfde huishoudcode gebruiken zonder het productie-record te overschrijven. Gebruik bij voorkeur een **aparte GitHub-repository** voor de beta, bijvoorbeeld `Samen-thuis-beta`.

## Wat zit erin?

- Vandaag-dashboard;
- Agenda;
- Weekmenu;
- Boodschappen;
- Huishouden;
- Voorraad;
- Ideeën;
- Woning;
- Reizen met reismappen en submappen;
- universele Import-pagina voor tekst/bestanden;
- Instellingen;
- dagelijkse vraag voor Kees en Daphne;
- PWA/offline cache;
- lokale JSON-back-ups;
- versleutelde Supabase-sync;
- productie-back-up kopiëren naar beta;
- bewerken met potlood en verwijderen per item;
- automatische koppeling Voorraad → Boodschappen;
- automatische supermarktprijscontrole via een Supabase Edge Function;
- handmatige én aangeleerde bodemprijzen.

## Hoe de bodemprijs werkt

Per gevolgd product bewaart de app een prijs-track. Die bevat:

- zoekterm;
- eventueel voorkeurswinkel;
- handmatige goede-prijsgrens;
- handmatige bodemprijsgrens;
- laatste actuele aanbieding;
- eigen prijshistorie.

De status wordt zo bepaald:

1. **Bodemprijs**: actuele prijs is ≤ handmatige bodemprijs, of ≤ aangeleerde 15e percentielgrens.
2. **Goede prijs**: actuele prijs is ≤ handmatige goede-prijsgrens, ≤ aangeleerde 35e percentielgrens, of de aanbieding heeft minimaal 25% korting.
3. **Aanbieding**: er is een actuele aanbieding, maar nog onvoldoende bewijs dat dit een goede/bodemprijs is.
4. **Geen actuele aanbieding**: de bron levert op dit moment geen actieve aanbieding voor deze zoekterm.

De app leert pas grenzen bij minimaal **vier verschillende prijzen van dezelfde huidige productmatch** (base product-id waar mogelijk; anders exact dezelfde productnaam). Zo worden verschillende merken/verpakkingen niet zomaar door elkaar gebruikt.

## Voorraad → Boodschappen

Als `in huis ≤ minimum`, maakt de app automatisch een open boodschappenregel aan. De hoeveelheid is:

`gewenst - in huis`, minimaal 1.

Als het boodschappenitem vanuit Voorraad komt en je vinkt het als gekocht af, verhoogt de beta automatisch de voorraad met die hoeveelheid. Maak je het vinkje ongedaan, dan draait de beta die automatische voorraadmutatie weer terug.

## Prijsbron

De Edge Function gebruikt de zoek-API van PrijsProfeet en vraagt uitsluitend actieve aanbiedingen op. De app gebruikt de eerste relevante fuzzy match en toont de gevonden productnaam, zodat je kunt controleren of de zoekterm nauwkeurig genoeg is.

De gratis API is vooral een **aanbiedingenbron**, geen volledig supermarktschap. Deze gratis beta gebruikt bewust géén betaalde matching of prijshistorie. De app bouwt haar eigen historie op uit de actieve aanbiedingen die zij voor jullie gevolgde producten ontvangt.

## Bestanden

```text
index.html
styles.css
manifest.webmanifest
icon.svg
sw.js
js/
  app.js
  store.js
  utils.js
  prices.js
  sync.js
  importer.js
supabase/
  schema.sql
  functions/
    grocery-prices/
      index.ts
```

## Installeren als aparte beta

Zie `INSTALLATIE_BETA.md` voor de precieze stappen.
