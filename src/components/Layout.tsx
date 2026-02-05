
import React from "react";
import { NavigationMenu } from "./ui/NavigationMenu";
import { Footer } from "./Footer";

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-100 via-pink-50 to-yellow-100">
            <NavigationMenu />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
