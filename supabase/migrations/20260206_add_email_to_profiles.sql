-- 1. Add email column to profiles
alter table public.profiles add column if not exists email text;

-- 2. Update the trigger to auto-save email on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'username',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- 3. Backfill emails for existing users
-- We use a DO block to update profiles based on the auth.users table
do $$
begin
  update public.profiles p
  set email = u.email
  from auth.users u
  where p.id = u.id and p.email is null;
end $$;
