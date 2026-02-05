-- 1. Verify and Add Missing Columns (Self-healing script)
-- Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;

-- Products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 10;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_details JSONB DEFAULT '{}';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]';

-- 2. Force Refresh the PostgREST Schema Cache
-- This is the most important part to fix the "schema cache" error
NOTIFY pgrst, 'reload schema';
