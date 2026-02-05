import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, ArrowLeft, Plus, Minus, BadgeCheck, Image as ImageIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, getProductById } = useProducts();
  const { isAdmin } = useUser();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const product = getProductById(id || "");
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState("story");

  useEffect(() => {
    if (product) {
      setMainImage(product.imageUrl);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id, product]);

  if (!product) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Deduplicate related products by name to avoid visual clutter if DB has duplicates
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .filter((p, index, self) => index === self.findIndex((t) => t.name === p.name))
    .slice(0, 4);

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="text-muted-foreground hover:text-foreground">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-amber-900 font-medium">{product.name}</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm mb-6 hover:text-amber-700 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Boutique
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="aspect-square bg-amber-50 rounded-2xl overflow-hidden border border-amber-100 shadow-inner relative">
              {(!mainImage && !product.imageUrl) ? (
                <div className="absolute inset-0 flex items-center justify-center text-amber-200">
                  <ImageIcon size={64} />
                </div>
              ) : null}
              <img
                src={mainImage || product.imageUrl || (product.images && product.images.length > 0 ? product.images[0] : "")}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590080875515-8a3a8dc238ad?q=80&w=800";
                  (e.target as HTMLImageElement).classList.add('opacity-0');
                }}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? "border-amber-600 scale-105" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 uppercase tracking-wider text-[10px]">
                {product.category}
              </Badge>
              {product.new && <Badge className="bg-emerald-500">New Arrival</Badge>}
            </div>

            <h1 className="text-4xl font-bold text-amber-950 mb-4">{product.name}</h1>

            <p className="text-3xl font-bold mb-6 text-amber-900 flex items-center gap-1">
              <span className="text-xl">₹</span>
              {product.price.toLocaleString("en-IN")}
            </p>

            <div className="prose prose-amber max-w-none mb-8">
              <p className="text-lg text-amber-800/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm font-medium text-amber-900 mb-1">Availability</span>
                  {product.stock === 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-sm font-bold border border-rose-100">
                      Out of Stock
                    </span>
                  ) : product.stock < 5 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-bold border border-amber-100">
                      {isAdmin ? `Only ${product.stock} units left` : "Limited Stock"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100">
                      In Stock {isAdmin && `(${product.stock} available)`}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="block text-sm font-medium text-amber-900 mb-1">Quantity</span>
                  <div className="flex items-center bg-white border border-amber-100 rounded-full p-1 shadow-sm">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1 || product.stock === 0}
                      className="h-8 w-8 rounded-full hover:bg-amber-50"
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-10 text-center font-bold text-amber-900">{quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock || product.stock === 0}
                      className="h-8 w-8 rounded-full hover:bg-amber-50"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl shadow-lg shadow-amber-200 transition-all active:scale-95"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {product.stock === 0 ? "Join Waiting List" : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  className="h-14 w-14 rounded-2xl border-amber-200 text-amber-600 hover:bg-amber-50"
                >
                  <Heart size={20} />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 text-amber-800/60 text-xs">
                <div className="flex items-center gap-1">
                  <BadgeCheck size={14} className="text-amber-600" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center gap-1">
                  <BadgeCheck size={14} className="text-amber-600" />
                  <span>Sustainable Pack</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-20">
          <div className="flex justify-center border-b border-amber-100 mb-10">
            <div className="flex space-x-12">
              <button
                onClick={() => setActiveTab("story")}
                className={`px-4 py-4 font-bold text-amber-950 uppercase tracking-widest text-xs border-b-2 transition-all duration-300 ${activeTab === "story" ? "border-amber-600 text-amber-900" : "border-transparent text-amber-700/50 hover:text-amber-700"}`}
              >
                Product Story
              </button>
              <button
                onClick={() => setActiveTab("ingredients")}
                className={`px-4 py-4 font-bold text-amber-950 uppercase tracking-widest text-xs border-b-2 transition-all duration-300 ${activeTab === "ingredients" ? "border-amber-600 text-amber-900" : "border-transparent text-amber-700/50 hover:text-amber-700"}`}
              >
                Ingredients & Nutrition
              </button>
              <button
                onClick={() => setActiveTab("shelf")}
                className={`px-4 py-4 font-bold text-amber-950 uppercase tracking-widest text-xs border-b-2 transition-all duration-300 ${activeTab === "shelf" ? "border-amber-600 text-amber-900" : "border-transparent text-amber-700/50 hover:text-amber-700"}`}
              >
                Shelf Life
              </button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center min-h-[200px] transition-all duration-500">
            {activeTab === "story" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-lg text-amber-900/80 leading-relaxed italic font-serif">
                  "{product.description}"
                </p>
                <div className="mt-8 bg-amber-50/50 p-8 rounded-3xl border border-dashed border-amber-200">
                  <p className="text-amber-800 leading-relaxed">
                    Experience the authentic taste of our small-batch {product.name.toLowerCase()}.
                    Each pack represents our commitment to quality and traditional methods,
                    ensuring you get a snack that's not just delicious but also wholesome.
                    Handcrafted with love in our boutique kitchen.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
                    <h3 className="font-bold text-amber-900 mb-4 uppercase text-xs tracking-wider">Key Ingredients</h3>
                    <ul className="space-y-2 text-sm text-amber-800">
                      <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-emerald-600" /> Premium Quality Grains/Nuts</li>
                      <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-emerald-600" /> Organic Cold-Pressed Oil</li>
                      <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-emerald-600" /> Hand-ground Traditional Spices</li>
                      <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-emerald-600" /> Himalayan Pink Salt</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
                    <h3 className="font-bold text-amber-900 mb-4 uppercase text-xs tracking-wider">Nutrition Facts (per 100g)</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-amber-50 pb-2">
                        <span className="text-amber-700">Energy</span>
                        <span className="font-semibold text-amber-900">450 Kcal</span>
                      </div>
                      <div className="flex justify-between border-b border-amber-50 pb-2">
                        <span className="text-amber-700">Protein</span>
                        <span className="font-semibold text-amber-900">12g</span>
                      </div>
                      <div className="flex justify-between border-b border-amber-50 pb-2">
                        <span className="text-amber-700">Carbohydrates</span>
                        <span className="font-semibold text-amber-900">65g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Fats</span>
                        <span className="font-semibold text-amber-900">18g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shelf" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100 inline-block">
                  <h3 className="font-bold text-amber-900 mb-4 text-xl">Freshness Guaranteed</h3>
                  <p className="text-amber-800 mb-6 max-w-lg mx-auto">
                    This product is best before <span className="font-bold">6 months</span> from the date of manufacturing.
                    Store in a cool, dry place away from direct sunlight. Once opened, store in an airtight container to maintain crispness.
                  </p>
                  <div className="flex justify-center gap-4 text-xs font-semibold uppercase tracking-wider text-amber-700">
                    <span className="px-3 py-1 bg-white rounded-full border border-amber-100">No Preservatives</span>
                    <span className="px-3 py-1 bg-white rounded-full border border-amber-100">100% Natural</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <FeaturedProducts
          title="Other Treasures You Mix-Match"
          products={relatedProducts}
        />
      </div>
    </Layout>
  );
};

export default ProductDetail;
