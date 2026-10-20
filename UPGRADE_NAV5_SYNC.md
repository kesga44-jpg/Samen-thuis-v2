# Upgrade: vijf hoofdsecties + veilige huishoudsync (fase 1-3)

## Inventaris: oude → nieuwe locatie
| Pagina (key) | Nieuwe sectie › subpagina |
|---|---|
| Dashboard (today) | Vandaag › Dashboard |
| Weer (weather) | Vandaag › Weer |
| Agenda (planning) | Agenda › Agenda & planning |
| Date ideeën (ideas) | Agenda › Date ideeën |
| Taken (tasks) | Taken › Taken |
| Weekmenu (meals) | Huishouden › Weekmenu |
| Boodschappen (groceries) | Huishouden › Boodschappen |
| Aanbiedingen (offers) | Huishouden › Aanbiedingen |
| Voorraad + vriezer/mealprep (stock) | Huishouden › Voorraad & vriezer |
| Huishouden/routines (chores) | Huishouden › Routines |
| Woning (home) | Huishouden › Woning |
| Budget/financiën (budget19) | Huishouden › Financiën |
| Reizen, Challenges, Programma's, Auto, Importeren, Extra, Instellingen | Meer › (zelfde namen) |

Geen pagina verwijderd. Deep links/`SamenThuisGo(key)` werken ongewijzigd; `nav-groups.js` legt alleen een 5-secties-balk, subtabs, breadcrumb en terugknop over de bestaande navigatie (oude items verborgen via CSS). Laatst bezochte subpagina per sectie wordt onthouden (sessionStorage).

## Gewijzigd/toegevoegd
`nav-core.js`, `nav-groups.js`, `css/layout.css`, `index.html`, `sw.js`, `nav-core.test.js`, `migration-security.test.js`,
`supabase/migrations/20261014000000_household_state_sync.sql` (+ `.rollback.sql`), `supabase/manual/phase3_revoke_anon_household_data.sql`.

## Migraties (handmatig, volgorde)
1. Back-up: exporteer household_data en coach_data (en de app-back-up op beide apparaten).
2. `20261012000000_personal_preferences.sql` → `20261013000000_chalkboard.sql` → `20261014000000_household_state_sync.sql`.
   Nieuw: `household_state` (RLS, alleen leden lezen), `put_household_state` (versiecontrole, SQLSTATE 40001 bij conflict), `import_legacy_household_data` (kopieert, wijzigt niets), maximaal 2 leden per huishouden.
3. Rollback: `20261014000000_household_state_sync.rollback.sql`. Oude sync blijft intussen ongewijzigd werken.
4. Fase 3 (pas na bewezen werking op 2 apparaten): `supabase/manual/phase3_revoke_anon_household_data.sql`.

## Testen op twee apparaten
Account A maakt huishouden (create_household), account B voegt toe met code; wijzig op A een taak, controleer B; zet A offline, wijzig, ga online; controleer conflictmelding en dat lokale back-up/herstel nog werkt.

## Niet gedaan / risico's
- Client-side overschakeling van sync.js naar Supabase Auth + `put_household_state` is NIET geïmplementeerd: zonder live Supabase of browser niet veilig verifieerbaar. Zolang dat ontbreekt blijft de anon-policy bestaan (bekend risico); volgende stap: auth-UI + per-sectie sync + eenmalige `import_legacy_household_data`, daarna fase 3.
- Niet gedaan in deze PR: weer-grafiek/kledingadvies, pollen/luchtkwaliteit, inbox/meldingen, pushnotificaties, prullenbak-uitbreiding, per-account accentkleur-UI (personal-preferences-core bestaat al).
- Navigatie niet in een browser getest; alleen unit-/statische tests.
