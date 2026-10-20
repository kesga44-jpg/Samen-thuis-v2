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

## Update (vervolg in dezelfde PR): werkelijke status
**Geïmplementeerd**
- `household-sync-core.js`: REST-client (Supabase Auth-JWT van het bestaande `authSession25`; nooit een service-role key), `planSections` (sync per onderdeel/top-level sleutel; `settings` en `meta` blijven lokaal), versiecontrole via `put_household_state` (SQLSTATE 40001 → conflict), foutclassificatie (auth, migratie ontbreekt, netwerk, verkeerde code).
- `account-sync.js`: opt-in knop "Overstappen naar accountsync" bij Instellingen (huishouden aanmaken/toevoegen via bestaande RPC's, uitnodigingscode, max. 2 accounts server-side). Bij overstap wordt `import_legacy_household_data` aangeroepen (kopieert de oude versleutelde rij naar sectie `legacy_full`; niets wordt overschreven). Na overstap draait alleen de nieuwe route (`syncNow` wordt omgeleid) zodat oude en nieuwe sync elkaar niet overschrijven; "Terug naar oude code-sync" zet dit terug.
- Behouden: herstelvlag (`hold` → conflict i.p.v. overschrijven), lege lokale data haalt cloud op en pusht nooit, veiligheidskopie (`samenThuisPreAccountSyncBackup`) vóór het toepassen van cloudgegevens, per-onderdeel conflictkeuze (mijn versie / cloudversie), versleuteling met dezelfde huishoudcode (AES-GCM, ongewijzigd), offline: lokaal bewaren en synchroniseren bij `online`, sleutel-/autorisatiefouten stoppen vóór schrijven. Basisstand per `gebruiker:huishouden`, dus een accountwissel overschrijft niets stilzwijgend.
- `inbox-core.js`/`inbox.js`: 🔔-knop in de topbalk met ongelezen-teller, gelezen/ongelezen, verwijderen, herinneringen afgeleid uit taken/routines, agenda, vriezer, voorraad en syncconflicten; meldingsvoorkeuren per account (lokaal per account-ID; gedeelde huishouddata wordt niet gewijzigd).
- `weather-advice-core.js`/`weather-extras.js`: kledingadvies met SVG-illustraties en pollen/luchtkwaliteit (bron Open-Meteo + peiltijd, offline cache, "niet beschikbaar" i.p.v. verzonnen waarden) op de Weerpagina. De temperatuurgrafieken met waarden bestonden al (`chart25`) en zijn niet herbouwd.
- Bestaand en dus niet herbouwd: Supabase Auth-aanmelding, persoonlijke accentkleur/dashboardvoorkeuren (`personal_preferences`), huishouden aanmaken/joinen (krijtbord).
- Navigatie: oude items zijn `display:none` (geen focus, niet in toegankelijkheidsboom); getest op bereikbaarheid van alle 19 pagina's. Geen wijziging nodig.

**Tests (`node --test <bestand>`)**: alle `*.test.js` slagen, o.a. `household-sync-core.test.js` (twee leden, autorisatie met RLS-nabootsing, versieconflict en race, offline, legacy-import, herstelvlag, verkeerde sleutel, aansluiting migratie↔client), `inbox-core.test.js`, `weather-advice-core.test.js`, `nav-core.test.js`, `migration-security.test.js`. JS-syntaxis gecontroleerd met `node --check`.

**NIET uitgevoerd**: browser-/apparaattests (de browsertool was niet beschikbaar), live Supabase (migratie niet toegepast, geen credentials), echte e-mailbevestiging. De server-RLS is alleen met een nabootsing getest; test `household_state` na het toepassen van de migratie op twee echte accounts.

**Niet gebouwd (bewust)**: pushmeldingen — vereisen service worker-push, VAPID-sleutels en een server-side verzender; zonder die configuratie zou het nepfunctionaliteit zijn. Volgende stap: VAPID-sleutelpaar genereren (privésleutel alleen als Edge Function-secret), tabel voor push-subscriptions met RLS, Edge Function voor verzenden. Meldingsvoorkeuren staan niet in `personal_preferences` (cloud) maar lokaal per account.

**Resterende risico's**: de anon-policies op `household_data` blijven bestaan tot fase 3 (`supabase/manual/phase3_revoke_anon_household_data.sql`) — pas toe nadat beide apparaten op accountsync draaien én een verse export is gemaakt. Eerste synchronisatie versleutelt elk onderdeel apart (PBKDF2 250k iteraties) en kan enkele seconden duren. Het bestaande krijtbord/huishoudlid-RPC `join_household` geeft toegang met alleen de uitnodigingscode; de limiet van 2 leden wordt door de migratie-trigger afgedwongen.

## Handmatige stappen
1. Back-up: exporteer `household_data`/`coach_data` en maak in de app een back-up op beide apparaten.
2. Pas migraties toe in volgorde: `20261012…`, `20261013…`, `20261014…`.
3. Beide accounts: aanmelden (Instellingen › Persoonlijk account); account A maakt huishouden, B voegt toe met de uitnodigingscode.
4. A: Instellingen › Accountsynchronisatie › Overstappen. Controleer conflictlijst; kies per onderdeel. Daarna B hetzelfde.
5. Test: wijziging op A zichtbaar op B; offline wijzigen en online zetten; conflict forceren.
6. Rollback: "Terug naar oude code-sync" in de app (lokale data intact; veiligheidskopie in `samenThuisPreAccountSyncBackup`), en daarna desgewenst `20261014000000_household_state_sync.rollback.sql`.
