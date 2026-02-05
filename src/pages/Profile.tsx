import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { User, Package, Mail, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { OrderHistory } from "@/components/profile/OrderHistory";

// Add email to the schema so it is included in the form.
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().optional(),
  pinCode: z.string().min(5, "PIN code must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
});

const Profile = () => {
  const { user, logout, updateProfile } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: (user as any)?.city || "",
      pinCode: user?.pinCode || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      setIsSubmitting(true);
      updateProfile(values);
    } catch (error) {
      console.error("Update profile error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-full md:w-1/3 space-y-4">
              <Card className="border-amber-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-amber-700" />
                    </div>
                    <div className="space-y-1 text-center">
                      <h2 className="text-xl font-bold text-amber-900">{user?.name}</h2>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center justify-center mt-1">
                        {user?.isVerified ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Verified Account
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-amber-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base text-amber-900">Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium text-muted-foreground">Username:</span>
                    <p className="font-medium">{user?.username}</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-muted-foreground">Email:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-medium truncate">{user?.email}</p>
                      {user?.isVerified ? (
                        <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-100 text-green-800 border-green-200">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] h-4 px-1 bg-yellow-100 text-yellow-800 border-yellow-200">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-muted-foreground">Member Since:</span>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-2/3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-2 bg-amber-50 p-1 rounded-xl">
                  <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-800 data-[state=active]:shadow-sm">Profile Info</TabsTrigger>
                  <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-800 data-[state=active]:shadow-sm">Order History</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="pt-4">
                  <Card className="border-amber-100 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-amber-900 font-bold">Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal details for a better shopping experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Amit Sharma" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                                  <Input placeholder="e.g. 9876543210" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="e.g. Flat No. 402, Shanti Apartments, Powai, Mumbai"
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Mumbai" {...field} />
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
                                  <Input placeholder="e.g. 400076" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating Profile
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="orders" className="pt-4">
                  <Card className="border-amber-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-amber-50/30 border-b border-amber-100/50 pb-6">
                      <CardTitle className="text-amber-900 font-bold text-2xl font-playfair">Order History</CardTitle>
                      <CardDescription className="text-amber-800/60">
                        View and track all your previous orders from Homemade Delights
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 px-0 md:px-6">
                      <OrderHistory />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

