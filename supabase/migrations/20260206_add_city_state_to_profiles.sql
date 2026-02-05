-- Add city and state columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text;

-- Update RLS policies just in case (though existing ones usually cover "all columns" for update/select if defined broadly, 
-- but ensuring users can update their own new columns is good practice if column-level security was used.
-- Since we use row-level security, existing policies for UPDATE usually cover the whole row.)
