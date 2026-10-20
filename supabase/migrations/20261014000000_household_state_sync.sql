-- Fase 2: beveiligde, per-onderdeel gesynchroniseerde huishoudstate voor ingelogde leden.
-- Additief en herhaalbaar. Raakt household_data en coach_data NIET aan.
-- Volgorde: 20261012 personal_preferences -> 20261013 chalkboard -> deze migratie.
-- Payloads zijn client-side versleuteld (zelfde sleutel als de bestaande sync).

create table if not exists public.household_state (
  household_id uuid not null references public.households(id) on delete cascade,
  section text not null check (char_length(section) between 1 and 60),
  payload jsonb not null,
  version bigint not null default 1,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (household_id, section)
);

alter table public.household_state enable row level security;
revoke all on public.household_state from anon, authenticated;
grant select on public.household_state to authenticated;

drop policy if exists "members read state" on public.household_state;
create policy "members read state" on public.household_state
  for select to authenticated using (public.is_household_member(household_id));
-- Geen directe insert/update/delete: schrijven loopt via put_household_state (versiecontrole).

-- Maximaal twee accounts per huishouden.
create or replace function public.limit_household_members()
returns trigger language plpgsql as $$
begin
  perform pg_advisory_xact_lock(hashtext(new.household_id::text));
  if (select count(*) from public.household_members where household_id = new.household_id) >= 2 then
    raise exception 'Een huishouden ondersteunt maximaal twee accounts';
  end if;
  return new;
end $$;
drop trigger if exists household_members_limit on public.household_members;
create trigger household_members_limit before insert on public.household_members
  for each row execute function public.limit_household_members();

-- Schrijven met optimistische versiecontrole: voorkomt dat twee apparaten elkaar overschrijven.
-- p_expected_version = 0 betekent "nieuw onderdeel". Bij conflict volgt een fout (SQLSTATE 40001).
create or replace function public.put_household_state(p_household uuid, p_section text, p_payload jsonb, p_expected_version bigint)
returns bigint language plpgsql security definer set search_path = public as $$
declare current_version bigint;
begin
  if auth.uid() is null or not public.is_household_member(p_household) then
    raise exception 'Geen toegang tot dit huishouden' using errcode = '42501';
  end if;
  select version into current_version from public.household_state
    where household_id = p_household and section = p_section for update;
  if current_version is null then
    if p_expected_version <> 0 then raise exception 'Versieconflict' using errcode = '40001'; end if;
    insert into public.household_state (household_id, section, payload, updated_by)
      values (p_household, p_section, p_payload, auth.uid());
    return 1;
  end if;
  if current_version <> p_expected_version then raise exception 'Versieconflict' using errcode = '40001'; end if;
  update public.household_state set payload = p_payload, version = current_version + 1,
    updated_by = auth.uid(), updated_at = now()
    where household_id = p_household and section = p_section;
  return current_version + 1;
end $$;

-- Eenmalige, niet-destructieve kopie van de oude anon-rij (id = gehashte huishoudcode) naar de nieuwe tabel.
create or replace function public.import_legacy_household_data(p_household uuid, p_legacy_id text)
returns boolean language plpgsql security definer set search_path = public as $$
declare legacy jsonb; inserted int;
begin
  if auth.uid() is null or not public.is_household_member(p_household) then
    raise exception 'Geen toegang tot dit huishouden' using errcode = '42501';
  end if;
  select payload into legacy from public.household_data where id = p_legacy_id;
  if legacy is null then return false; end if;
  insert into public.household_state (household_id, section, payload, updated_by)
    values (p_household, 'legacy_full', legacy, auth.uid())
    on conflict do nothing;
  get diagnostics inserted = row_count;
  return inserted > 0;
end $$;

revoke all on function public.put_household_state(uuid, text, jsonb, bigint),
  public.import_legacy_household_data(uuid, text) from public, anon;
grant execute on function public.put_household_state(uuid, text, jsonb, bigint),
  public.import_legacy_household_data(uuid, text) to authenticated;
