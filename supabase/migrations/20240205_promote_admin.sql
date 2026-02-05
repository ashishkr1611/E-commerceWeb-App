-- SQL to promote a user to Admin role
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/cxfdexukpmnruleqxowa/sql/new

UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'aashu.connects@gmail.com'
);

-- Verify the change
SELECT id, username, full_name, role 
FROM public.profiles 
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'aashu.connects@gmail.com'
);
