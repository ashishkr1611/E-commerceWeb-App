-- 1. Product Enhancements
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- 2. Profile Enhancements
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;

-- 3. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS on Activity Logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs" ON public.activity_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can insert logs" ON public.activity_logs
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. Helper Function to Log Activity
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_action TEXT,
    p_entity_type TEXT,
    p_entity_id TEXT,
    p_details JSONB DEFAULT '{}'
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.activity_logs (admin_id, action, entity_type, entity_id, details)
    VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger for Product Changes Audit
CREATE OR REPLACE FUNCTION audit_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.activity_logs (admin_id, action, entity_type, entity_id, details)
        VALUES (
            auth.uid(), 
            'UPDATE', 
            'product', 
            NEW.id::text, 
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
        );
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.activity_logs (admin_id, action, entity_type, entity_id, details)
        VALUES (
            auth.uid(), 
            'DELETE', 
            'product', 
            OLD.id::text, 
            jsonb_build_object('deleted_record', row_to_json(OLD))
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Drop existing trigger if it exists to allow re-running script
DROP TRIGGER IF EXISTS audit_product_changes_trigger ON public.products;

CREATE TRIGGER audit_product_changes_trigger
    AFTER UPDATE OR DELETE ON public.products
    FOR EACH ROW EXECUTE PROCEDURE audit_product_changes();

-- 7. Order Enhancements
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_details JSONB DEFAULT '{}';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]';

-- 8. Trigger to track Order Status changes
CREATE OR REPLACE FUNCTION track_order_status_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        NEW.status_history = NEW.status_history || jsonb_build_object(
            'status', NEW.status,
            'changed_at', timezone('utc'::text, now()),
            'changed_by', auth.uid()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER track_order_status_trigger
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE PROCEDURE track_order_status_changes();
