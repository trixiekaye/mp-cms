-- Profiles (linked to Supabase Auth users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'admin',
  created_at timestamptz default now()
);

-- Blogs
create table blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  is_featured boolean default false,
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Media Items
create table media_items (
  id uuid default gen_random_uuid() primary key,
  file_name text not null,
  file_url text not null,
  file_type text,
  file_size bigint,
  storage_path text,
  created_at timestamptz default now()
);

-- Home Page Sections Config (JSON-based, single row)
create table site_config (
  id int primary key default 1,
  about_me_text text,
  about_me_image_url text,
  contact_email text,
  contact_message text,
  updated_at timestamptz default now()
);

-- Seed one row for site config
insert into site_config (id) values (1) on conflict do nothing;

-- RLS Policies
alter table blogs enable row level security;
alter table media_items enable row level security;
alter table site_config enable row level security;

create policy "Public read published blogs"
  on blogs for select using (is_published = true);

create policy "Admin full access blogs"
  on blogs for all using (auth.role() = 'authenticated');

create policy "Admin full access media"
  on media_items for all using (auth.role() = 'authenticated');

create policy "Admin full access site_config"
  on site_config for all using (auth.role() = 'authenticated');
