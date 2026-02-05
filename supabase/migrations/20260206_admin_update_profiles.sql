-- Allow Admins to update profiles (e.g. for blocking/unblocking users)
drop policy if exists "Admins can update all profiles" on public.profiles;

create policy "Admins can update all profiles" on public.profiles
  for update using (
    public.is_admin()
  );
