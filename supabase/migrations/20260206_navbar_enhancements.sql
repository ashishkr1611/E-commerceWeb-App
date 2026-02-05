-- 1. Create Wishlist Table
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Policies for Wishlist
CREATE POLICY "Users can view their own wishlist" 
ON public.wishlist FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist" 
ON public.wishlist FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist" 
ON public.wishlist FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);


-- 2. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    label TEXT NOT NULL,
    path TEXT NOT NULL,
    icon TEXT,
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    requires_auth BOOLEAN DEFAULT false,
    requires_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Policies for Menu Items
-- Everyone can read menu items (filtering logic will happen in frontend based on visibility/auth)
CREATE POLICY "Everyone can read menu items" 
ON public.menu_items FOR SELECT 
TO public 
USING (true);

-- Only admins can modify menu items
-- Using a subquery to check admin role in profiles can sometimes cause recursion if profiles also checks something complex.
-- For simplicity and safety in this migration, we'll assume the profiles check is safe or we can rely on application logic + basic auth guard for now 
-- BUT robust RLS is better. Let's try the standard profile check.
CREATE POLICY "Admins can manage menu items" 
ON public.menu_items FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Seed Default Menu Items
INSERT INTO public.menu_items (label, path, sort_order, requires_auth, requires_admin) VALUES
('Home', '/', 10, false, false),
('Shop', '/products', 20, false, false),
('About', '/about', 30, false, false),
('Profile', '/profile', 80, true, false),
('Admin', '/admin', 90, true, true)
ON CONFLICT DO NOTHING;
