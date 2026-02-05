
import React from "react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/data";
import { useProducts } from "@/context/ProductContext";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export function FeaturedProducts({ title, subtitle, products }: FeaturedProductsProps) {
  return (
    <section className="py-12">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-800 font-playfair tracking-tight">{title}</h2>
          {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProductsSection() {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.featured && p.isPublished !== false).slice(0, 4);

  return (
    <FeaturedProducts
      title="Our Best Sellers"
      subtitle="The most loved authentic snacks from our home kitchen"
      products={featuredProducts}
    />
  );
}

export function NewArrivalsSection() {
  const { products } = useProducts();
  const newProducts = products.filter(p => p.new && p.isPublished !== false).slice(0, 4);

  return (
    <FeaturedProducts
      title="New Arrivals"
      subtitle="Freshly made snacks, new in our collection"
      products={newProducts}
    />
  );
}
