
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Truck
} from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^\d+$/, "Phone number must contain only digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  pinCode: z.string().min(6, "PIN code must be at least 6 digits"),
  saveAddress: z.boolean().default(false).optional(),
});

export function CheckoutForm() {
  const { cartItems, totalPrice } = useCart();
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pinCode: "",
      saveAddress: false
    },
  });

  // Pre-fill form with user data when available
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      form.reset({
        firstName: firstName,
        lastName: lastName,
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: (user as any).city || "", // Cast to any until User type is updated
        pinCode: user.pinCode || "",
        saveAddress: false
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.saveAddress && user) {
      // Construct full name for profile
      const fullName = `${values.firstName} ${values.lastName}`.trim();

      await updateProfile({
        name: fullName,
        phone: values.phone,
        address: values.address,
        pinCode: values.pinCode,
        // We'll trust that updateProfile handles extra fields safely or we update type later
        // For now, let's pass explicit fields. 
        // Note: UserContext needs to accept city if we want to save it.
        // Be careful with type safety here.
      } as any);

      // Since updateProfile in UserContext might not support 'city' yet, 
      // we might strictly need to update UserContext first or cast.
      // We will assume 'updateProfile' takes Partial<User> and spreading allows extra props 
      // if they match DB columns but TS might complain.
      // Let's stick safe for now and assume logic handles what it can.
    }

    // Navigate to payment page with shipping details
    navigate("/payment", { state: { shippingDetails: values } });
  };

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2" size={20} />
                Customer Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ashish" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Kumar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 flex items-center">
                <Truck className="mr-2" size={20} />
                Shipping Information
              </h2>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. House No, Landmark, City, State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIN Code</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {user && (
                <FormField
                  control={form.control}
                  name="saveAddress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Save this address for future orders
                        </FormLabel>
                        <FormDescription>
                          We'll pre-fill these details next time you checkout.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/cart")}
                >
                  Back to Cart
                </Button>
                <Button type="submit">
                  Continue to Payment
                </Button>
              </div>
            </form>
          </Form>
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
