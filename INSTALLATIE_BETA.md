# Samen Thuis β installeren

## 1. Maak een aparte GitHub-repository

Aanbevolen naam:

`Samen-thuis-beta`

Upload **alle bestanden en mappen uit dit pakket** naar de root van die repository.

Gebruik niet de huidige productie-repository als je beide apps tegelijk via GitHub Pages wilt kunnen openen. Een aparte repository geeft automatisch een aparte Pages-URL en voorkomt verwarring.

## 2. Zet GitHub Pages aan

In de beta-repository:

1. **Settings**
2. **Pages**
3. **Build and deployment → Deploy from a branch**
4. Branch: **main**
5. Map: **/(root)**
6. **Save**

Na publicatie kun je de beta in Safari openen en **Zet op beginscherm** kiezen. Het icoon en de naam zijn bewust anders: `Samen Thuis β`.

## 3. Supabase tabel

Als je productie-app al met hetzelfde Supabase-project synchroniseert en `household_data` al bestaat, hoef je meestal niets te doen.

Anders: open **Supabase → SQL Editor** en voer `supabase/schema.sql` één keer uit.

De beta maakt een ander record-id dan productie, ook wanneer je dezelfde huishoudcode gebruikt.

## 4. Prijsfunctie deployen

De supermarktprijzen worden niet rechtstreeks vanuit de browser opgehaald. Hiervoor zit een Supabase Edge Function in:

`supabase/functions/grocery-prices/index.ts`

Met de Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref vwfuetxgapzfivydzhxc
npx supabase functions deploy grocery-prices --no-verify-jwt
```

De beta gebruikt daarna automatisch:

`<jouw-supabase-url>/functions/v1/grocery-prices`

### PrijsProfeet: volledig gratis

Voor deze versie is **geen betaald PrijsProfeet-abonnement nodig** en ook geen API-key vereist. De Edge Function gebruikt alleen het gratis publieke zoekendpoint. De app toont PrijsProfeet als bron, zoals de gratis API-voorwaarden vereisen.

De app gebruikt geen `/match/*` en geen `/price-history` endpoints. In plaats daarvan bewaart Samen Thuis zelf alleen de prijswaarnemingen van producten die jullie daadwerkelijk volgen.

## 5. Bestaande gegevens kopiëren naar beta

In je huidige productie-app:

1. maak een JSON-back-up;
2. open `Samen Thuis β`;
3. ga naar **Instellingen**;
4. kies **Productie-back-up kopiëren**;
5. selecteer de productie-back-up.

De gegevens worden omgezet naar het beta-schema. Je originele productie-app wordt niet gewijzigd.

## 6. Bodemprijzen testen

1. Ga naar **Voorraad**.
2. Voeg bijvoorbeeld `Calvé pindakaas 350g` toe.
3. `Prijs volgen` staat bij nieuwe voorraadproducten standaard aan.
4. Vul eventueel in:
   - Goede prijs: bijvoorbeeld `2.49`
   - Bodemprijs: bijvoorbeeld `1.99`
5. Sla op.
6. Kies **Prijzen vernieuwen**.

De app toont ook de productmatch. Klopt die niet, druk op het potlood en maak de zoekterm specifieker.

## 7. Automatisch verversen

Onder **Instellingen → Voorraad & prijzen** kun je kiezen voor 6, 12, 24 of 48 uur.

Een PWA op iOS kan niet betrouwbaar zelfstandig blijven draaien wanneer hij volledig gesloten is. Daarom controleert deze beta automatisch:

- bij openen;
- wanneer de app weer actief wordt;
- wanneer internetverbinding terugkomt;
- en alleen als de vorige prijscontrole oud genoeg is.

Dat voorkomt onnodige API-calls en houdt de zichtbare prijzen actueel wanneer je de app gebruikt.

## 8. Lokale test op laptop

ES-modules werken het betrouwbaarst via HTTP. Start in de appmap bijvoorbeeld:

```bash
python3 -m http.server 8000
```

Open daarna `http://localhost:8000`.
