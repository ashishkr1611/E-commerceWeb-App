import React from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Mail,
  Smartphone,
  Truck,
  DollarSign
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const cardFormSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits").max(19),
  cardName: z.string().min(2, "Name on card must be at least 2 characters"),
  expiration: z.string().regex(/^\d{2}\/\d{2}$/, "Expiration date must be in MM/YY format"),
  cvv: z.string().min(3, "CVV must be at least 3 digits").max(4),
});

const upiFormSchema = z.object({
  upiId: z.string().regex(/^[\w\.\-]+@[\w\.\-]+$/, "Please enter a valid UPI ID (e.g., username@bank)"),
});

const codFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export function PaymentForm() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const shippingDetails = location.state?.shippingDetails || null;

  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      cardName: user?.name || "",
      expiration: "",
      cvv: "",
    },
  });

  const upiForm = useForm<z.infer<typeof upiFormSchema>>({
    resolver: zodResolver(upiFormSchema),
    defaultValues: {
      upiId: "",
    },
  });

  const codForm = useForm<z.infer<typeof codFormSchema>>({
    resolver: zodResolver(codFormSchema),
    defaultValues: {
      name: `${shippingDetails?.firstName} ${shippingDetails?.lastName}` || user?.name || "",
      phone: shippingDetails?.phone || user?.phone || "",
    },
  });

  const onCardSubmit = (values: z.infer<typeof cardFormSchema>) => {
    toast({
      title: "Payment Processed",
      description: "Your payment has been successfully processed!",
      duration: 3000,
    });

    handlePaymentSuccess();
  };

  const onUPISubmit = (values: z.infer<typeof upiFormSchema>) => {
    toast({
      title: "UPI Payment Initiated",
      description: "Please check your UPI app to complete the payment",
      duration: 3000,
    });

    handlePaymentSuccess();
  };

  const onCODSubmit = (values: z.infer<typeof codFormSchema>) => {
    toast({
      title: "Order Confirmed",
      description: "Your Cash on Delivery order has been placed successfully!",
      duration: 3000,
    });

    handlePaymentSuccess();
  };

  const handlePaymentSuccess = async () => {
    if (user) {
      try {
        // Prepare items for RPC
        const itemsForStock = cartItems.map(item => ({
          id: item.product.id,
          quantity: item.quantity
        }));

        // Call the RPC to check stock, deduct stock, and create order atomically
        const { data: generatedOrderId, error } = await (supabase as any).rpc('handle_order_with_stock', {
          p_user_id: user.id,
          p_total_amount: totalPrice + (totalPrice * 0.05),
          p_order_details: {
            items: cartItems.map(item => ({
              id: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            })),
            shipping: shippingDetails
          },
          p_items: itemsForStock
        });

        if (error) {
          if (error.message.includes('Insufficient stock')) {
            toast({
              title: "Out of Stock",
              description: "Some items in your cart are no longer available in the requested quantity. Please check your cart.",
              variant: "destructive"
            });
            navigate("/cart");
            return;
          }
          throw error;
        }

        console.log("Order processed via RPC successfully:", generatedOrderId);

        // Try to trigger order confirmation email
        try {
          await supabase.functions.invoke("send-user-mail", {
            body: {
              email: user.email,
              type: "order_confirmation",
              name: user.name,
              orderDetails: {
                total: (totalPrice + (totalPrice * 0.05)).toFixed(2),
                items: cartItems.map(i => `${i.product.name} (x${i.quantity})`).join(", ")
              }
            },
          });
        } catch (mailError) {
          console.warn("Order mail trigger error:", mailError);
        }

        toast({
          title: "Order Processed",
          description: "Your order has been placed successfully!",
        });

        setTimeout(() => {
          clearCart();
          navigate("/payment-success", { state: { orderId: generatedOrderId } });
        }, 1500);
      } catch (error: any) {
        console.error("Order processing error:", error);
        toast({
          title: "Order Failed",
          description: error.message || "We couldn't process your order. Please try again.",
          variant: "destructive"
        });
        return; // Don't redirect or clear cart on hard error
      }
    } else {
      // For guest checkout (if applicable) or fallback
      setTimeout(() => {
        clearCart();
        navigate("/payment-success");
      }, 1500);
    }
  };

  React.useEffect(() => {
    if (!shippingDetails && cartItems.length > 0) {
      navigate("/checkout");
    }
  }, [shippingDetails, navigate, cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg mb-4">Your cart is empty</p>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card className="p-6">
          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Card
              </TabsTrigger>
              <TabsTrigger value="upi" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                UPI
              </TabsTrigger>
              <TabsTrigger value="cod" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Cash on Delivery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card">
              <Form {...cardForm}>
                <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-6">
                  <FormField
                    control={cardForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="4242 4242 4242 4242" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={cardForm.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input placeholder="RAHUL KHANNA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={cardForm.control}
                      name="expiration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={cardForm.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center mt-4 p-4 bg-muted/50 rounded-md">
                    <ShieldCheck className="text-primary mr-2" size={20} />
                    <p className="text-sm text-muted-foreground">
                      Your payment information is secure and encrypted
                    </p>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/checkout")}
                    >
                      Back to Shipping
                    </Button>
                    <Button type="submit">
                      Complete Payment
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="upi">
              <Form {...upiForm}>
                <form onSubmit={upiForm.handleSubmit(onUPISubmit)} className="space-y-6">
                  <FormField
                    control={upiForm.control}
                    name="upiId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPI ID</FormLabel>
                        <FormControl>
                          <Input placeholder="username@upi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center mt-4 p-4 bg-muted/50 rounded-md">
                    <ShieldCheck className="text-primary mr-2" size={20} />
                    <p className="text-sm text-muted-foreground">
                      Your UPI transaction is secure and protected
                    </p>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/checkout")}
                    >
                      Back to Shipping
                    </Button>
                    <Button type="submit">
                      Pay with UPI
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="cod" className="mt-4">
              <Form {...codForm}>
                <form onSubmit={codForm.handleSubmit(onCODSubmit)} className="space-y-6">
                  <FormField
                    control={codForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Rahul Khanna" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={codForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center mt-4 p-4 bg-muted/50 rounded-md">
                    <Truck className="text-primary mr-2" size={20} />
                    <p className="text-sm text-muted-foreground">
                      Pay in cash at the time of delivery
                    </p>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/checkout")}
                    >
                      Back to Shipping
                    </Button>
                    <Button type="submit">
                      Place Order
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          {cartItems.length > 0 && (
            <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium flex items-center gap-1">
                    <span>₹</span>
                    {(item.product.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="flex items-center gap-1">
                <span>₹</span>
                {totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST 5%)</span>
              <span className="flex items-center gap-1">
                <span>₹</span>
                {(totalPrice * 0.05).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="flex items-center gap-1 text-primary">
                <span>₹</span>
                {(totalPrice + (totalPrice * 0.05)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </Card>

        <div className="mt-4 p-4 bg-muted/50 rounded-md border">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-2">
            If you have any questions about your order, please contact our customer service.
          </p>
          <a href="mailto:support@homemadedelights.com" className="text-sm text-primary hover:underline block font-medium">
            support@homemadedelights.com
          </a>
        </div>
      </div>
    </div>
  );
}
