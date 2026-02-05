import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from './UserContext';
import { toast } from '@/components/ui/use-toast';
import { Product } from '@/lib/data';

type WishlistContextType = {
    wishlist: string[]; // Array of Product IDs
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch wishlist on load or user change
    useEffect(() => {
        if (!user) {
            setWishlist([]);
            return;
        }

        const fetchWishlist = async () => {
            setLoading(true);
            const { data, error } = await (supabase as any)
                .from('wishlist')
                .select('product_id')
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching wishlist:', error);
            } else {
                setWishlist(data.map((item: any) => item.product_id));
            }
            setLoading(false);
        };

        fetchWishlist();
    }, [user]);

    const addToWishlist = async (productId: string) => {
        if (!user) {
            toast({ title: "Please sign in", description: "You need to be logged in to use the wishlist.", variant: "destructive" });
            return;
        }

        // Optimistic update
        setWishlist(prev => [...prev, productId]);

        const { error } = await (supabase as any)
            .from('wishlist')
            .insert({ user_id: user.id, product_id: productId });

        if (error) {
            console.error('Error adding to wishlist:', error);
            // Revert on error
            setWishlist(prev => prev.filter(id => id !== productId));
            toast({
                title: "Error",
                description: `Could not add to wishlist: ${error.message || 'Unknown error'}`,
                variant: "destructive"
            });
        } else {
            toast({ title: "Added to Wishlist", description: "Product saved to your wishlist." });
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user) return;

        // Optimistic update
        setWishlist(prev => prev.filter(id => id !== productId));

        const { error } = await (supabase as any)
            .from('wishlist')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);

        if (error) {
            console.error('Error removing from wishlist:', error);
            // Revert on error
            setWishlist(prev => [...prev, productId]);
            toast({ title: "Error", description: "Could not remove from wishlist", variant: "destructive" });
        } else {
            toast({ title: "Removed", description: "Product removed from wishlist." });
        }
    };

    const isInWishlist = (productId: string) => wishlist.includes(productId);

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
