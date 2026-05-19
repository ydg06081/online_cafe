create table if not exists public.sessions (
  id            uuid primary key default gen_random_uuid(),
  nickname      text not null,
  current_menu  text not null,
  menu_count    int  not null default 1,
  menu_history  jsonb not null default '[]'::jsonb,
  purpose       text not null default '',
  duration_sec  int  not null,
  started_at    timestamptz not null default now(),
  expires_at    timestamptz not null,
  current_zone  text not null default 'notebook' check (current_zone in ('notebook','terrace')),
  appearance    jsonb not null,
  seat_slot     int,
  status        text not null default 'active' check (status in ('active','ended'))
);

create index if not exists sessions_zone_status_idx on public.sessions (current_zone, status);
create index if not exists sessions_expires_idx on public.sessions (expires_at) where status = 'active';

alter table public.sessions enable row level security;

create policy "anon read active sessions" on public.sessions
  for select using (status = 'active');

create policy "anon insert sessions" on public.sessions
  for insert with check (true);

create policy "anon update sessions" on public.sessions
  for update using (true) with check (true);

alter publication supabase_realtime add table public.sessions;
