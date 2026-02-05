
import React, { useState, useEffect } from "react";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Check if we have a session (Supabase automatically handles the hash from the email link)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast({
                    title: "Invalid Link",
                    description: "This password reset link is invalid or has expired.",
                    variant: "destructive",
                });
                navigate("/login");
            }
        };
        checkSession();
    }, [navigate]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            const { error } = await supabase.auth.updateUser({
                password: values.password,
            });

            if (error) throw error;

            setIsSuccess(true);
            toast({
                title: "Password Updated",
                description: "Your password has been successfully reset.",
            });

            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message || "Failed to update password",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="container py-12">
                <div className="max-w-md mx-auto">
                    <Card className="shadow-lg border-amber-100">
                        <CardHeader className="space-y-1 bg-amber-50/50 rounded-t-xl">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-amber-800">
                                <Lock size={20} /> Reset Password
                            </CardTitle>
                            <CardDescription>
                                Choose a new secure password for your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isSuccess ? (
                                <div className="text-center space-y-4 py-4">
                                    <div className="flex justify-center">
                                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                                    </div>
                                    <p className="text-muted-foreground">
                                        Your password has been updated! Redirecting شما to sign in...
                                    </p>
                                    <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => navigate("/login")}>
                                        Go to Sign In
                                    </Button>
                                </div>
                            ) : (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="••••••••" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="••••••••" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating Password
                                                </>
                                            ) : (
                                                "Update Password"
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default ResetPassword;
