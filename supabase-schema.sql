-- Prajapati Media Hub — Supabase Production Schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- USERS / ROLES
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text unique,
  email text,
  role text not null default 'sales',
  team text,
  city text,
  status text default 'active',
  created_at timestamptz default now()
);

-- CLIENTS
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  email text,
  company text,
  gst text,
  city text,
  address text,
  created_at timestamptz default now()
);

-- ORDERS
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_no text unique not null,
  client_id uuid references public.clients(id) on delete set null,
  client_name text,
  phone text,
  city text,
  media text,
  qty integer default 0,
  rate numeric default 0,
  base_amount numeric default 0,
  gst_amount numeric default 0,
  total_amount numeric default 0,
  advance_amount numeric default 0,
  status text default 'Lead',
  current_stage integer default 0,
  priority text default 'Medium',
  locations text,
  notes text,
  sales_by text,
  due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- EXECUTION ASSIGNMENTS
create table if not exists public.execution_assignments (
  id uuid primary key default uuid_generate_v4(),
  assignment_no text unique not null,
  order_id uuid references public.orders(id) on delete cascade,
  order_no text,
  client_name text,
  city text,
  location text,
  team_name text,
  team_lead text,
  target_qty integer default 0,
  radius_km numeric default 5,
  scheduled_date date,
  status text default 'Assigned',
  notes text,
  created_at timestamptz default now()
);

-- EXECUTION PROOFS
create table if not exists public.execution_proofs (
  id uuid primary key default uuid_generate_v4(),
  proof_no text unique not null,
  assignment_id uuid references public.execution_assignments(id) on delete cascade,
  order_no text,
  vehicle_no text not null,
  driver_name text,
  mobile text,
  latitude numeric,
  longitude numeric,
  accuracy numeric,
  photo_url text,
  ocr_confidence numeric,
  duplicate boolean default false,
  verified boolean default true,
  remarks text,
  captured_at timestamptz default now(),
  created_by text
);

-- EXPENSES
create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  expense_no text unique not null,
  order_no text,
  assignment_no text,
  date date default current_date,
  head text,
  amount numeric default 0,
  paid_to text,
  status text default 'Pending',
  approved_by text,
  notes text,
  created_at timestamptz default now()
);

-- LEADS
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  lead_no text unique not null,
  name text not null,
  phone text,
  city text,
  source text,
  requirement text,
  budget numeric,
  status text default 'New',
  next_followup date,
  assigned_to text,
  notes text,
  created_at timestamptz default now()
);

-- REPORTS
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  report_no text unique not null,
  order_no text,
  client_name text,
  total_qty integer default 0,
  completed_qty integer default 0,
  pending_qty integer default 0,
  report_url text,
  csv_url text,
  status text default 'Ready',
  created_at timestamptz default now()
);

-- WATI LOGS
create table if not exists public.whatsapp_logs (
  id uuid primary key default uuid_generate_v4(),
  order_no text,
  phone text,
  template_name text,
  message text,
  status text default 'queued',
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- INDEXES
create index if not exists idx_orders_order_no on public.orders(order_no);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_city on public.orders(city);
create index if not exists idx_proofs_vehicle on public.execution_proofs(vehicle_no);
create index if not exists idx_proofs_assignment on public.execution_proofs(assignment_id);
create index if not exists idx_assignments_order on public.execution_assignments(order_no);

-- STORAGE BUCKET NOTE:
-- Create bucket in Supabase dashboard:
-- bucket name: execution-proofs
-- public access: ON for now, later make private with signed URLs
