import React from "react";
import { Layout } from "@/components/Layout";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
    const { wishlist, loading } = useWishlist();
    const { products } = useProducts();
    const navigate = useNavigate();

    // Filter products that are in the wishlist
    const wishlistProducts = products.filter((product) => wishlist.includes(product.id));

    return (
        <Layout>
            <div className="container py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
                    <h1 className="text-3xl font-bold font-heading text-primary">My Wishlist</h1>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="h-[350px] bg-gray-100 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-amber-50/50 rounded-2xl border border-amber-100">
                        <Heart className="h-16 w-16 text-amber-200 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-amber-900 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Save items you love so you can easily find them later.
                        </p>
                        <Button onClick={() => navigate("/products")} className="bg-amber-600 hover:bg-amber-700">
                            Start Shopping
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Wishlist;
