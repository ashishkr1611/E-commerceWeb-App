import React from "react";
import { Link } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { FeaturedProductsSection, NewArrivalsSection } from "@/components/FeaturedProducts";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="w-full min-h-[50vh] relative z-0">
        <Hero />
      </div>

      <FeaturedProductsSection />

      {/* Section: About & Browse */}
      <section className="py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg my-12 mx-2 md:mx-0">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-amber-800 drop-shadow">About Our Snacks</h2>
            <p className="text-muted-foreground mb-6">
              Homemade Delights brings the tradition of home kitchens right to your door—discover a growing collection of Namkeen, mithai, snacks, and bites handcrafted with love.
              Only the finest ingredients. Traditional recipes. Made by real people.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold rounded-full px-6 py-3 shadow-md">
                <Link to="/products">Browse Snacks</Link>
              </Button>
              <Button asChild variant="outline" className="border-amber-300 text-amber-700 rounded-full px-6 py-3">
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-10">
        <NewArrivalsSection />
      </div>
    </Layout>
  );
};

export default Index;
