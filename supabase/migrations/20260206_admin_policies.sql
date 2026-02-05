-- Add policies for Admins to access all data

-- 1. Profiles: Admins can view all profiles
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 2. Orders: Admins can view all orders
drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders" on public.orders
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 3. Orders: Admins can update all orders (e.g. changing status)
drop policy if exists "Admins can update all orders" on public.orders;
create policy "Admins can update all orders" on public.orders
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
