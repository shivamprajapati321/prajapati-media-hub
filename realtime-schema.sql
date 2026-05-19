-- Prajapati Media Hub — Phase 12 Realtime + Audit + Notifications
-- Run after the main Supabase schema.

-- LIVE ACTIVITY FEED
create table if not exists public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_name text,
  actor_role text,
  action text not null,
  module text,
  order_no text,
  assignment_no text,
  vehicle_no text,
  message text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- TEAM LIVE STATUS
create table if not exists public.team_live_status (
  id uuid primary key default uuid_generate_v4(),
  team_name text not null,
  team_lead text,
  phone text,
  city text,
  current_location text,
  latitude numeric,
  longitude numeric,
  accuracy numeric,
  online boolean default false,
  today_target integer default 0,
  today_done integer default 0,
  last_upload_at timestamptz,
  updated_at timestamptz default now()
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_role text,
  user_phone text,
  title text not null,
  body text,
  type text default 'info',
  module text,
  order_no text,
  read boolean default false,
  created_at timestamptz default now()
);

-- DEVICE SESSIONS / SECURITY
create table if not exists public.device_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_phone text,
  user_name text,
  role text,
  device_id text,
  browser text,
  ip_address text,
  city text,
  last_seen_at timestamptz default now(),
  active boolean default true,
  created_at timestamptz default now()
);

-- CLIENT VIEWS
create table if not exists public.client_report_views (
  id uuid primary key default uuid_generate_v4(),
  order_no text,
  client_name text,
  viewer_phone text,
  viewer_email text,
  report_no text,
  viewed_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

-- Helpful indexes
create index if not exists idx_activity_created on public.activity_logs(created_at desc);
create index if not exists idx_activity_order on public.activity_logs(order_no);
create index if not exists idx_team_status_name on public.team_live_status(team_name);
create index if not exists idx_notifications_role on public.notifications(user_role, read);
create index if not exists idx_notifications_phone on public.notifications(user_phone, read);

-- Realtime:
-- In Supabase Dashboard → Database → Replication:
-- Enable realtime for:
-- activity_logs
-- team_live_status
-- notifications
-- execution_proofs
-- execution_assignments
-- orders
