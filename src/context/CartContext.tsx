import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { isAdmin } = useUser();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart");
    }

    // Calculate totals
    setTotalItems(
      cartItems.reduce((total, item) => total + item.quantity, 0)
    );

    setTotalPrice(
      cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      )
    );
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      // Check if product already exists in cart
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // Check if adding more would exceed stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast({
            title: "Item Limit Reached",
            description: isAdmin
              ? `We only have ${product.stock} items in stock.`
              : "We don't have enough items in stock for your request.",
            variant: "destructive"
          });
          return prevItems;
        }

        // Update quantity if product already in cart
        const updatedItems = prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        toast({
          title: "Cart updated",
          description: `${product.name} quantity updated in your cart.`,
          duration: 2000,
        });
        return updatedItems;
      } else {
        // Check if initial quantity exceeds stock
        if (quantity > product.stock) {
          toast({
            title: "Insufficient Stock",
            description: isAdmin
              ? `We only have ${product.stock} items in stock.`
              : "Requested quantity exceeds available stock.",
            variant: "destructive"
          });
          return prevItems;
        }

        // Add new product to cart
        toast({
          title: "Added to cart",
          description: `${product.name} added to your cart.`,
          duration: 2000,
        });
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(
        (item) => item.product.id === productId
      );
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.product.name} removed from your cart.`,
          duration: 2000,
        });
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            toast({
              title: "Stock limit",
              description: isAdmin
                ? `Only ${item.product.stock} available.`
                : "Cannot increase quantity further.",
              variant: "destructive"
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
      duration: 2000,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
