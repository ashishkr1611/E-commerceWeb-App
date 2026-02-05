
import React from "react";
import { CartItem as CartItemType } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus, Image as ImageIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  const [imageError, setImageError] = React.useState(false);

  // Use main image, or first from gallery, or fallback
  const displayImage = !imageError
    ? (product.imageUrl || (product.images && product.images.length > 0 ? product.images[0] : ""))
    : "https://images.unsplash.com/photo-1590080875515-8a3a8dc238ad?q=80&w=200";

  const handleIncreaseQuantity = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-amber-50 group hover:bg-amber-50/30 transition-colors px-2 rounded-lg">
      <div className="flex flex-1 w-full sm:w-auto items-center">
        {/* Product Image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-amber-100/50 border border-amber-200/50 relative shadow-sm">
          {!displayImage || imageError ? (
            <div className="absolute inset-0 flex items-center justify-center text-amber-400">
              <ImageIcon size={32} />
            </div>
          ) : null}
          <img
            src={displayImage}
            alt={product.name}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageError ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        {/* Product Details */}
        <div className="ml-4 flex-grow">
          <h3 className="font-medium text-amber-950">{product.name}</h3>
          <p className="text-sm text-muted-foreground">₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Mobile: Actions Row (Quantity, Price, Remove) */}
      <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 sm:ml-6">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 bg-white rounded-md border border-amber-200/50 p-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            onClick={handleDecreaseQuantity}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </Button>

          <span className="w-8 text-center text-sm font-medium text-amber-900">{quantity}</span>

          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            onClick={handleIncreaseQuantity}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Total Price */}
          <span className="font-bold text-amber-900">
            ₹{(product.price * quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>

          {/* Remove Button */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
            onClick={handleRemove}
            aria-label="Remove item"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
