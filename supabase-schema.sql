create table if not exists orders (
  id bigint generated always as identity primary key,
  order_id text,
  client_name text,
  city text,
  media_type text,
  qty integer,
  rate numeric,
  total numeric,
  status text,
  created_at timestamp default now()
);

create table if not exists execution_proofs (
  id bigint generated always as identity primary key,
  order_id text,
  vehicle_no text,
  latitude numeric,
  longitude numeric,
  image_url text,
  team_name text,
  created_at timestamp default now()
);

create table if not exists leads (
  id bigint generated always as identity primary key,
  company_name text,
  phone text,
  city text,
  status text,
  budget numeric,
  created_at timestamp default now()
);

create table if not exists app_users (
  id bigint generated always as identity primary key,
  name text,
  phone text,
  role text,
  created_at timestamp default now()
);

create table if not exists notifications (
  id bigint generated always as identity primary key,
  title text,
  message text,
  role text,
  created_at timestamp default now()
);
