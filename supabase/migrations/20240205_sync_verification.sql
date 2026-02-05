-- Trigger to sync email verification status from auth.users to public.profiles
create or replace function public.handle_auth_user_update()
returns trigger as $$
begin
  if (new.email_confirmed_at is not null and old.email_confirmed_at is null) then
    update public.profiles
    set is_verified = true
    where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if it exists
drop trigger if exists on_auth_user_updated on auth.users;

-- Create trigger on auth.users
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_auth_user_update();
