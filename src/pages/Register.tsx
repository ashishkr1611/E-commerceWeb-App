
import React, { useState } from "react";
import { NavigationMenu } from "@/components/ui/NavigationMenu";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Loader2, CheckCircle2, Mail } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define a schema that matches the required User properties
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email address").refine(
    (email) => email.endsWith("@gmail.com"),
    { message: "Only @gmail.com addresses are allowed" }
  ),
});

// This ensures that all fields are required and match what UserContext expects
type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const { register } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      // Now the values object will have all required properties
      // Explicitly casting to ensure TypeScript treats all fields as required
      await register({
        username: values.username,
        password: values.password,
        email: values.email,
        name: values.username, // Using username as name since name field is removed
        phone: "",
        address: "",
        pinCode: ""
      });
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-amber-100">
            <CardHeader className="space-y-1 bg-amber-50/50 rounded-t-xl">
              <CardTitle className="text-2xl font-bold flex items-center gap-2 text-amber-800">
                <UserPlus size={20} /> Create your account
              </CardTitle>
              <CardDescription>
                Join Homemade Delights and discover authentic snacks
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {registrationSuccess ? (
                <div className="space-y-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Mail className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">Verify your email</h3>
                    <p className="text-gray-500">
                      We've sent a verification link to <span className="font-medium text-gray-900">{form.getValues("email")}</span>.
                    </p>
                  </div>
                  <Alert className="bg-amber-50 border-amber-200 text-amber-800 text-left">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Registration Successful</AlertTitle>
                    <AlertDescription>
                      Once you verify your email, you'll be able to access your profile and track your orders.
                    </AlertDescription>
                  </Alert>
                  <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                    <Link to="/login">Go to Login</Link>
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter username" {...field} />
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
                              <Input type="email" placeholder="example@gmail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 border-t pt-4">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-amber-600 underline underline-offset-4 hover:text-amber-700 font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
