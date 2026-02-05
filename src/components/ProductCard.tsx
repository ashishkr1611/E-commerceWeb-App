import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useWishlist } from "@/context/WishlistContext"; // Added useWishlist
import { ShoppingCart, IndianRupee, Image as ImageIcon, Heart } from "lucide-react"; // Added Heart
import { cn } from "@/lib/utils"; // Added cn

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => { // Changed function declaration
  const { addToCart } = useCart();
  const { isAdmin } = useUser();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // Added wishlist hooks
  const navigate = useNavigate(); // Added useNavigate

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const toggleWishlist = (e: React.MouseEvent) => { // Added toggleWishlist function
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const isLiked = isInWishlist(product.id); // Added isLiked state

  const [imageError, setImageError] = React.useState(false);
  const displayImage = !imageError
    ? (product.imageUrl || (product.images && product.images.length > 0 ? product.images[0] : ""))
    : "https://images.unsplash.com/photo-1590080875515-8a3a8dc238ad?q=80&w=400";

  return (
    <div className="group relative">
      {/* Product Image with Link */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-xl bg-amber-50 h-64 sm:h-72 relative border border-amber-100/50 shadow-sm transition-shadow hover:shadow-md">
        <div className="aspect-square relative overflow-hidden bg-gray-100 flex items-center justify-center h-full w-full">
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors z-10"
            aria-label="Toggle Wishlist"
          >
            <Heart size={18} className={cn("transition-colors", isLiked ? "fill-rose-500 text-rose-500" : "text-gray-600")} />
          </button>

          {!displayImage || imageError ? (
            <div className="absolute inset-0 flex items-center justify-center text-amber-200 bg-amber-50">
              <ImageIcon size={48} />
            </div>
          ) : null}
          <img
            src={displayImage}
            alt={product.name}
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${imageError ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        {/* Badge Indicators */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.new && (
            <Badge className="bg-secondary text-secondary-foreground">New</Badge>
          )}
          {product.featured && (
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="destructive" className="bg-rose-600">Out of Stock</Badge>
          )}
          {product.stock > 0 && product.stock < 5 && (
            <Badge variant="outline" className="bg-amber-100 text-amber-900 border-amber-200">
              {isAdmin ? `Only ${product.stock} Left` : "Limited Stock"}
            </Badge>
          )}
          {product.stock >= 5 && (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
              In Stock {isAdmin && `(${product.stock})`}
            </Badge>
          )}
        </div>

        {/* Quick add button - visible on mobile, hover on desktop */}
        <div className="absolute bottom-0 left-0 right-0 p-2 md:opacity-0 md:transform md:translate-y-2 md:transition-all md:duration-200 md:group-hover:opacity-100 md:group-hover:translate-y-0 bg-gradient-to-t from-black/60 to-transparent md:bg-none">
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <ShoppingCart size={16} />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </Link>

      {/* Product Info - now completely separate from the hover element */}
      <div className="mt-3">
        <h3 className="font-bold text-amber-900">
          <Link to={`/product/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-lg font-bold flex items-center gap-1 text-primary">
          <IndianRupee size={16} className="inline-block" />
          {product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
