-- Rollback van 20261014000000. Handmatig uit te voeren; raakt household_data niet aan.
-- Let op: verwijdert alleen de NIEUWE kopie; de oude anon-sync blijft ongewijzigd werken.
-- Bewaar eerst een export van public.household_state indien nodig.
drop function if exists public.import_legacy_household_data(uuid, text);
drop function if exists public.put_household_state(uuid, text, jsonb, bigint);
drop trigger if exists household_members_limit on public.household_members;
drop function if exists public.limit_household_members();
drop table if exists public.household_state;
