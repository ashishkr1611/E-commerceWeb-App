import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Sliders, Grid3X3, List, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Products = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [tempPriceRanges, setTempPriceRanges] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handlePriceChange = (rangeId: string) => {
    setTempPriceRanges(prev => {
      if (prev.includes(rangeId)) {
        return prev.filter(id => id !== rangeId);
      } else {
        return [...prev, rangeId];
      }
    });
  };

  const applyFilters = () => {
    setSelectedPriceRanges(tempPriceRanges);
  };

  useEffect(() => {
    // Check if a category was passed through navigation state
    if (location.state && (location.state as any).category) {
      setSelectedCategory((location.state as any).category);
    }
  }, [location]);

  const { getProductsByCategory, searchQuery, setSearchQuery, categories } = useProducts();

  const filteredByCategory = getProductsByCategory(selectedCategory).filter(p => p.isPublished !== false);

  const filterByPrice = (product: any) => {
    if (selectedPriceRanges.length === 0) return true;

    return selectedPriceRanges.some(range => {
      if (range === "under-200") return product.price < 200;
      if (range === "200-500") return product.price >= 200 && product.price <= 500;
      if (range === "500-1000") return product.price >= 500 && product.price <= 1000;
      if (range === "over-1000") return product.price > 1000;
      return false;
    });
  };

  const products = filteredByCategory.filter(p => {
    // Search Filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    // Price Filter
    return filterByPrice(p);
  });

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Shop All Products</h1>

        {searchQuery && (
          <div className="mb-6 flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-amber-800">
              Showing results for "<span className="font-bold">{searchQuery}</span>"
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="h-8 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-100/50 rounded-lg gap-1"
            >
              <X size={14} />
              Clear Search
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-amber-200 bg-amber-50/50 text-amber-900"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Sliders size={18} />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Sidebar / Filters */}
          <div className={`w-full md:w-72 flex-shrink-0 ${showMobileFilters ? "block animate-in slide-in-from-top-2" : "hidden md:block"}`}>
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Sliders size={18} className="text-primary" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>
              {/* Filters redesigned as cards */}
              <div className="space-y-4">

                {/* Category Filter */}
                <div className="rounded-2xl p-5 bg-white shadow-sm border">
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </div>

                {/* Price Range Filter */}
                <div className="rounded-2xl p-5 bg-white shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <IndianRupee size={18} className="text-primary" />
                    Price Range
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="price-1"
                        className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={tempPriceRanges.includes("under-200")}
                        onChange={() => handlePriceChange("under-200")}
                      />
                      <label htmlFor="price-1" className="cursor-pointer select-none">Under ₹200</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="price-2"
                        className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={tempPriceRanges.includes("200-500")}
                        onChange={() => handlePriceChange("200-500")}
                      />
                      <label htmlFor="price-2" className="cursor-pointer select-none">₹200 - ₹500</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="price-3"
                        className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={tempPriceRanges.includes("500-1000")}
                        onChange={() => handlePriceChange("500-1000")}
                      />
                      <label htmlFor="price-3" className="cursor-pointer select-none">₹500 - ₹1,000</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="price-4"
                        className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={tempPriceRanges.includes("over-1000")}
                        onChange={() => handlePriceChange("over-1000")}
                      />
                      <label htmlFor="price-4" className="cursor-pointer select-none">Over ₹1,000</label>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  className="w-full bg-primary rounded-xl shadow hover:bg-primary/90 transition"
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>

              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {products.length} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid3X3 size={16} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full sm:w-32 h-48 sm:h-32 bg-amber-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-lg font-bold text-amber-900 mb-1">{product.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 sm:line-clamp-3 mb-2">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-auto">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center gap-4 sm:min-w-[120px] pt-4 sm:pt-0 border-t sm:border-t-0 border-amber-100">
                      <p className="font-bold text-xl text-amber-900 flex items-center gap-1">
                        <span className="text-sm">₹</span>
                        {product.price.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                      </p>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700 rounded-full px-6">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
