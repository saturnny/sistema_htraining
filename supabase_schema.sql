-- DEV: libere tudo para anon/authenticated + RLS permissivo.
-- Produção: trocamos para policies restritas + Edge Functions.

create extension if not exists pg_trgm;

create table if not exists public.lots (
  id bigserial primary key,
  name text not null,
  price numeric(10,2) not null default 0,
  "limit" int not null default 0,
  status text not null check (status in ('open','closed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_lots_status on public.lots(status);

create table if not exists public.participants (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text not null,
  ticket_type text not null,
  lot_id bigint references public.lots(id) on delete set null,
  status text not null default 'pendente' check (status in ('pendente','presente')),
  created_at timestamptz not null default now()
);

create index if not exists idx_participants_status on public.participants(status);
create index if not exists idx_participants_lot on public.participants(lot_id);
create index if not exists idx_participants_email on public.participants using btree(email);
create index if not exists idx_participants_phone on public.participants using btree(phone);
create index if not exists idx_participants_name_trgm on public.participants using gin (name gin_trgm_ops);

-- GARANTE privilégios de tabela (além das policies)
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.lots to anon, authenticated;
grant select, insert, update, delete on public.participants to anon, authenticated;

-- para tabelas futuras nesta schema:
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;

-- RLS
alter table public.lots enable row level security;
alter table public.participants enable row level security;

-- Limpa QUALQUER policy preexistente (independente do nome)
do $$
declare r record;
begin
  for r in (select polname from pg_policies where schemaname='public' and tablename in ('lots','participants')) loop
    execute format('drop policy if exists %I on public.lots', r.polname);
    execute format('drop policy if exists %I on public.participants', r.polname);
  end loop;
end$$;

-- Policies bem explícitas por operação (permissivas)
create policy "anon select lots" on public.lots for select using (true);
create policy "anon insert lots" on public.lots for insert with check (true);
create policy "anon update lots" on public.lots for update using (true) with check (true);
create policy "anon delete lots" on public.lots for delete using (true);

create policy "anon select participants" on public.participants for select using (true);
create policy "anon insert participants" on public.participants for insert with check (true);
create policy "anon update participants" on public.participants for update using (true) with check (true);
create policy "anon delete participants" on public.participants for delete using (true);
