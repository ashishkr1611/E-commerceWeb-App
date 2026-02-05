
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

const ForgotPassword = () => {
    const { resetPassword } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            await resetPassword(values.email);
            setIsSent(true);
        } catch (error) {
            console.error("Reset password error:", error);
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
                                <KeyRound size={20} /> Forgot Password
                            </CardTitle>
                            <CardDescription>
                                {isSent
                                    ? "We've sent a recovery link to your email"
                                    : "Enter your email to receive a password reset link"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isSent ? (
                                <div className="text-center space-y-4">
                                    <p className="text-muted-foreground">
                                        If an account exists for <strong>{form.getValues("email")}</strong>, you will receive a password reset link shortly.
                                    </p>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link to="/login">Return to Sign In</Link>
                                    </Button>
                                </div>
                            ) : (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending Link
                                                </>
                                            ) : (
                                                "Send Reset Link"
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-2 border-t pt-4">
                            <Link to="/login" className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium">
                                <ArrowLeft size={14} /> Back to Sign In
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default ForgotPassword;
