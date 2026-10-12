# Slim sparen, accentkleur en aanbiedingen (status)

## Geïmplementeerd
- `savings-core.js` (+ `savings-core.test.js`): saldo (beginsaldo + stortingen), benodigde periodieke inleg, achterstand, verwachte einddatum, geplande vs. werkelijke inleg, ontdubbelde stortingen, voorstel voor verdeling op prioriteit/deadline.
- Budgetpagina (bestaande `budget23`): spaardoelen uitgebreid met frequentie, prioriteit, persoonlijk/gezamenlijk, type, pauzeren, stortingen en sectie "Slim sparen". Bestaande velden (`current`, `monthly`, …) behouden hun betekenis; nieuwe velden zijn optioneel. Opslaan van het voorstel past alleen de geplande `monthly` aan; er worden geen betalingen uitgevoerd.
- Accentkleur: vrije kleurkiezer in Instellingen (via bestaande `--blue` variabelen, per apparaat in localStorage). De bestaande 4 voorinstellingen blijven.
- `offers-core.js`: verlooplogica (einddatum inclusief, Europe/Amsterdam), archief-scheiding en ontdubbeling. Nog geen UI/bron aangesloten.

## Niet afgerond
- Aanbiedingenpagina, PrijsProfeet- en Pepper-integratie: niet onderzocht/gekoppeld (geen API-toegang of -documentatie vanuit deze omgeving geverifieerd). Er zijn geen endpoints verzonnen. Nodig: API-sleutel als Supabase-secret in een edge function (zie `supabase/functions/`).
- Dashboardeditor en per-gebruiker dashboards: niet gebouwd. De app heeft geen accounts (alleen een huishoudcode); accent en UI-voorkeuren staan daarom per apparaat. Echte per-persoon sync vereist Supabase Auth.
- Quote: titel is al "Quote of the day"; rotatie niet toegevoegd.
