-- DEV: abre tudo para anon/authenticated. Rode isso se continuar vendo RLS.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;

alter table public.lots enable row level security;
alter table public.participants enable row level security;

drop policy if exists "anon select lots" on public.lots;
drop policy if exists "anon insert lots" on public.lots;
drop policy if exists "anon update lots" on public.lots;
drop policy if exists "anon delete lots" on public.lots;

drop policy if exists "anon select participants" on public.participants;
drop policy if exists "anon insert participants" on public.participants;
drop policy if exists "anon update participants" on public.participants;
drop policy if exists "anon delete participants" on public.participants;

create policy "anon select lots" on public.lots for select using (true);
create policy "anon insert lots" on public.lots for insert with check (true);
create policy "anon update lots" on public.lots for update using (true) with check (true);
create policy "anon delete lots" on public.lots for delete using (true);

create policy "anon select participants" on public.participants for select using (true);
create policy "anon insert participants" on public.participants for insert with check (true);
create policy "anon update participants" on public.participants for update using (true) with check (true);
create policy "anon delete participants" on public.participants for delete using (true);
