-- Waitlist setup for website signups via anon RPC.
-- Goal: website visitors can join waitlist without direct table access.

create extension if not exists pgcrypto;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('Pfandgeber', 'Abholer')),
  postal_code text,
  name text,
  email text not null,
  email_normalized text generated always as (lower(btrim(email))) stored,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(btrim(email)) > 3),
  check (
    postal_code is null
    or postal_code ~ '^[0-9A-Za-z -]{3,12}$'
  )
);

create unique index if not exists waitlist_email_normalized_key
  on public.waitlist (email_normalized);

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

create or replace function public.set_waitlist_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_waitlist_set_updated_at on public.waitlist;
create trigger trg_waitlist_set_updated_at
before update on public.waitlist
for each row
execute function public.set_waitlist_updated_at();

alter table public.waitlist enable row level security;

-- Start locked down.
revoke all on table public.waitlist from public;
revoke all on table public.waitlist from anon;
revoke all on table public.waitlist from authenticated;

drop policy if exists "waitlist_authenticated_select" on public.waitlist;
drop policy if exists "waitlist_authenticated_insert" on public.waitlist;
drop policy if exists "waitlist_authenticated_update" on public.waitlist;
drop policy if exists "waitlist_authenticated_delete" on public.waitlist;
drop policy if exists "waitlist_anon_insert" on public.waitlist;

-- Insert-only flow: call RPC only, no direct table access.
create or replace function public.add_waitlist_signup(
  p_role text,
  p_postal_code text,
  p_name text,
  p_email text,
  p_source text default 'website'
)
returns table(inserted boolean, waitlist_id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_name text := nullif(btrim(coalesce(p_name, '')), '');
  v_postal_code text := nullif(btrim(coalesce(p_postal_code, '')), '');
  v_role text := btrim(coalesce(p_role, ''));
  v_source text := btrim(coalesce(p_source, ''));
  v_id uuid;
begin
  if v_role not in ('Pfandgeber', 'Abholer') then
    raise exception 'invalid role';
  end if;

  if v_email = '' or v_email !~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$' then
    raise exception 'invalid email';
  end if;

  if v_postal_code is not null and v_postal_code !~ '^[0-9A-Za-z -]{3,12}$' then
    raise exception 'invalid postal_code';
  end if;

  if v_source = '' then
    v_source := 'website';
  end if;

  insert into public.waitlist (role, postal_code, name, email, source)
  values (v_role, v_postal_code, v_name, v_email, v_source)
  on conflict (email_normalized) do nothing
  returning id into v_id;

  return query
    select (v_id is not null), v_id;
end;
$$;

revoke all on function public.add_waitlist_signup(text, text, text, text, text) from public;
grant execute on function public.add_waitlist_signup(text, text, text, text, text) to anon;
grant execute on function public.add_waitlist_signup(text, text, text, text, text) to authenticated;
