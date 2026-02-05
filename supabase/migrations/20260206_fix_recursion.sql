-- Fix Infinite Recursion by using a SECURITY DEFINER function
-- This allows us to check the user's role without triggering RLS recursively

-- 1. Create a secure function to check admin status
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public -- Secure the search path
as $$
begin
  return exists (
    select 1
    from profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

-- 2. Update Profiles Policy (Fixes Recursion)
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
  for select using (
    public.is_admin()
  );

-- 3. Update Orders Policy (Cleaner usage)
drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders" on public.orders
  for select using (
    public.is_admin()
  );

drop policy if exists "Admins can update all orders" on public.orders;
create policy "Admins can update all orders" on public.orders
  for update using (
    public.is_admin()
  );
