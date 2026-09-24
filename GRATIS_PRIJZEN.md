# Gratis bodemprijzen in Samen Thuis β

Deze versie kost €0 aan PrijsProfeet-abonnementen.

## Wat wordt gebruikt
- `GET /api/v1/search` via de Supabase Edge Function.
- Alleen resultaten met `promotion_status: active`.
- Geen Pro `/match/*`.
- Geen Pro `/price-history`.
- Geen externe betaalde prijsgeschiedenis.

## Hoe bodemprijs werkt
Samen Thuis bewaart alleen waarnemingen van producten die jij zelf volgt. Bij minimaal vier verschillende prijzen voor dezelfde productmatch kan de app een eigen goede-prijs- en bodemprijsgrens leren. Je kunt beide grenzen ook handmatig instellen.

## Beperking
De gratis PrijsProfeet-data is vooral aanbiedingsdata en geen volledig overzicht van alle reguliere schapprijzen. 'Geen aanbieding gevonden' betekent daarom niet dat het product niet te koop is.

## Bronvermelding
De app toont PrijsProfeet als prijsbron, omdat dit bij gratis API-gebruik verplicht is.
