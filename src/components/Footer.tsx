
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast({
                title: "Error",
                description: "Please enter an email address.",
                variant: "destructive",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            toast({
                title: "Error",
                description: "Only @gmail.com addresses are allowed for subscription.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Subscribed!",
            description: "You have successfully signed up for our newsletter.",
        });
        setEmail("");
    };

    return (
        <footer className="bg-gradient-to-r from-amber-600 to-pink-300 text-white py-12 mt-auto rounded-t-xl shadow-lg">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Homemade Delights</h3>
                        <p className="text-white/80">
                            Delicious handmade snacks crafted with love.
                            From crunchy namkeen to sweet mithai, enjoy authentic, small-batch treats delivered fresh!
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:underline">Home</Link></li>
                            <li><Link to="/products" className="hover:underline">Shop</Link></li>
                            <li><Link to="/about" className="hover:underline">About</Link></li>
                            <li><Link to="/" className="hover:underline">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
                        <p className="text-white/80 mb-4">
                            Sign up for our newsletter to get updates on new snacks and exclusive offers.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Enter your Gmail address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-grow px-4 py-2 text-foreground rounded-l-md focus:outline-none"
                                    aria-label="Email Address for Newsletter"
                                />
                                <Button
                                    type="submit"
                                    className="rounded-l-none bg-amber-700 text-white hover:bg-amber-800"
                                >
                                    Subscribe
                                </Button>
                            </div>
                            <p className="text-xs text-white/60">We respect your privacy. Unsubscribe at any time.</p>
                        </form>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/60">
                    <p>© {new Date().getFullYear()} Homemade Delights. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
