-- 1. Create Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  phone text,
  address text,
  pin_code text,
  is_verified boolean default false,
  role text default 'user' check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Products Table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  description text,
  category text,
  image_url text,
  is_featured boolean default false,
  is_new boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Orders Table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_amount numeric not null,
  order_details jsonb not null,
  email_sent boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Email Verifications Table
create table if not exists public.email_verifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  token text not null,
  verified_at timestamp with time zone,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.email_verifications enable row level security;

-- 6. RLS Policies (Safe versions with DROP first)
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Anyone can view products" on public.products;
create policy "Anyone can view products" on public.products for select using (true);

drop policy if exists "Admins can modify products" on public.products;
create policy "Admins can modify products" on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders" on public.orders for insert with check (auth.uid() = user_id);

-- 7. Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

-- Drop if exists and recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. Seed Initial Products (Using INSERT ON CONFLICT if helpful, but for now simple insert)
insert into public.products (name, price, description, category, image_url, is_featured, is_new)
values 
('Homemade Granola Clusters', 450, 'Crunchy oat clusters with honey, nuts, and dried fruits.', 'healthy', 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=2070', true, false),
('Artisanal Spiced Nuts Mix', 599, 'A delicious blend of almonds, cashews, and pecans.', 'savory', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=2070', true, true),
('Traditional Chocolate Chip Cookies', 350, 'Soft and chewy chocolate chip cookies made with real butter.', 'sweet', 'https://images.unsplash.com/photo-1499636138143-bd630f5cf386?q=80&w=2070', false, true),
('Cheese Crackers With Herbs', 250, 'Crispy, cheesy crackers seasoned with fresh herbs.', 'savory', 'https://images.unsplash.com/photo-1651695635284-a1563bb112d1?q=80&w=2071', true, false),
('Handcrafted Caramel Popcorn', 199, 'Sweet and crunchy popcorn coated in our homemade caramel sauce.', 'sweet', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=2070', false, true),
('Seasonal Fruit & Nut Bars', 499, 'Chewy fruit and nut bars made with seasonal dried fruits.', 'healthy', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=2074', true, false),
('Assorted Snack Gift Box', 1499, 'A curated selection of our most popular snacks.', 'gift', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070', false, true),
('Spicy Roasted Chickpeas', 150, 'Crunchy roasted chickpeas with a kick of spice.', 'savory', 'https://images.unsplash.com/photo-1541533848490-bc8115cd6522?q=80&w=2070', true, true);
