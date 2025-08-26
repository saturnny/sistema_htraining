-- DEV: desligar RLS temporariamente (não recomendado em prod)
alter table public.lots disable row level security;
alter table public.participants disable row level security;
