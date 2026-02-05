-- Update handle_order_with_stock to set initial status to 'pending'
CREATE OR REPLACE FUNCTION handle_order_with_stock(
  p_user_id UUID,
  p_total_amount NUMERIC,
  p_order_details JSONB,
  p_items JSONB -- Array of {id, quantity}
) RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  item_record RECORD;
BEGIN
  -- 1. Check if all items are in stock
  FOR item_record IN SELECT * FROM jsonb_to_recordset(p_items) AS x(id UUID, quantity INT)
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.products 
      WHERE id = item_record.id AND stock >= item_record.quantity
    ) THEN
      RAISE EXCEPTION 'Insufficient stock for product %', item_record.id;
    END IF;
  END LOOP;

  -- 2. Deduct stock
  FOR item_record IN SELECT * FROM jsonb_to_recordset(p_items) AS x(id UUID, quantity INT)
  LOOP
    UPDATE public.products 
    SET stock = stock - item_record.quantity
    WHERE id = item_record.id;
  END LOOP;

  -- 3. Create the order with 'pending' status
  INSERT INTO public.orders (user_id, total_amount, order_details, status)
  VALUES (p_user_id, p_total_amount, p_order_details, 'pending')
  RETURNING id INTO v_order_id;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
