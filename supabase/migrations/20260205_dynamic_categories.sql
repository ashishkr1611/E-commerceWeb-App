-- Create categories table
create table if not exists public.categories (
  id text primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.categories enable row level security;

-- RLS Policies
drop policy if exists "Anyone can view categories" on public.categories;
create policy "Anyone can view categories" on public.categories for select using (true);

drop policy if exists "Admins can modify categories" on public.categories;
create policy "Admins can modify categories" on public.categories for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Seed Initial Categories
insert into public.categories (id, name)
values 
('all', 'All Snacks'),
('savory', 'Namkeen & Savory'),
('sweet', 'Mithai & Sweets'),
('healthy', 'Healthy & Traditional'),
('gift', 'Gift Boxes')
on conflict (id) do nothing;
