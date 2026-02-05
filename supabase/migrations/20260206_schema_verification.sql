-- Schema Verification and Repair
-- Ensures all expected columns and tables exist with correct defaults

-- 1. Products Table Fixes
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 10;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- 2. Ensure Wishlist Table Exists
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- 3. Enable RLS for Wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- 4. Correct Policies (Self-healing)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wishlist' AND policyname = 'Users can view their own wishlist') THEN
        CREATE POLICY "Users can view their own wishlist" ON public.wishlist FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wishlist' AND policyname = 'Users can add to their own wishlist') THEN
        CREATE POLICY "Users can add to their own wishlist" ON public.wishlist FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wishlist' AND policyname = 'Users can remove from their own wishlist') THEN
        CREATE POLICY "Users can remove from their own wishlist" ON public.wishlist FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Reload schema cache
NOTIFY pgrst, 'reload schema';
