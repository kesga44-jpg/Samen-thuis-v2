-- FASE 3 - NIET automatisch uitvoeren. Pas toe zodra BEIDE apparaten aantoonbaar via
-- household_state synchroniseren en een verse export van household_data bestaat.
-- Rollback: de drie GRANT/POLICY-regels onderaan.
drop policy if exists "encrypted household read" on public.household_data;
drop policy if exists "encrypted household insert" on public.household_data;
drop policy if exists "encrypted household update" on public.household_data;
revoke select, insert, update on public.household_data from anon;
-- Rollback:
-- grant select, insert, update on public.household_data to anon;
-- create policy "encrypted household read" on public.household_data for select to anon using (true);
-- create policy "encrypted household insert" on public.household_data for insert to anon with check (true);
-- create policy "encrypted household update" on public.household_data for update to anon using (true) with check (true);
