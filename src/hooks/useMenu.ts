import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type MenuItem = {
    id: string;
    label: string;
    path: string;
    icon?: string;
    is_visible: boolean;
    sort_order: number;
    requires_auth: boolean;
    requires_admin: boolean;
};

export const useMenu = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const { data, error } = await (supabase as any)
                .from('menu_items')
                .select('*')
                .eq('is_visible', true)
                .order('sort_order', { ascending: true });

            if (error) throw error;

            if (data && data.length > 0) {
                setMenuItems(data);
            } else {
                // Fallback if DB is empty
                setMenuItems([
                    { id: '1', label: 'Home', path: '/', is_visible: true, sort_order: 10, requires_auth: false, requires_admin: false },
                    { id: '2', label: 'Shop', path: '/products', is_visible: true, sort_order: 20, requires_auth: false, requires_admin: false },
                    { id: '3', label: 'About', path: '/about', is_visible: true, sort_order: 30, requires_auth: false, requires_admin: false },
                ]);
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
            // Fallback to defaults if DB fails
            setMenuItems([
                { id: '1', label: 'Home', path: '/', is_visible: true, sort_order: 10, requires_auth: false, requires_admin: false },
                { id: '2', label: 'Shop', path: '/products', is_visible: true, sort_order: 20, requires_auth: false, requires_admin: false },
                { id: '3', label: 'About', path: '/about', is_visible: true, sort_order: 30, requires_auth: false, requires_admin: false },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    return { menuItems, loading, refreshMenu: fetchMenu };
};
