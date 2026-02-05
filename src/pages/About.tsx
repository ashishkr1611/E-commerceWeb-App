import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Utensils,
  Cookie,
  ChefHat,
  Salad,
  CakeSlice,
  Sandwich,
  Carrot,
  Apple,
  ShieldCheck,
  Zap,
  Leaf,
  Sparkles,
} from "lucide-react";
import { Layout } from "@/components/Layout";

const bihariSnacks = [
  {
    name: "Litti Chokha",
    desc: "A classic Bihari dish featuring roasted wheat balls stuffed with spicy sattu, served with mashed veggies.",
    icon: <ChefHat className="w-8 h-8 text-amber-700" />,
  },
  {
    name: "Thekua",
    desc: "Crispy, sweet wheat flour cookies flavored with coconut and jaggery, traditional festive treats.",
    icon: <Cookie className="w-8 h-8 text-amber-700" />,
  },
  {
    name: "Khaja",
    desc: "A multi-layered flaky pastry, deep-fried and dipped in sugar syrup—sweet and crunchy delight.",
    icon: <CakeSlice className="w-8 h-8 text-amber-700" />,
  },
  {
    name: "Sattu Paratha",
    desc: "Wheat flatbread stuffed with tasty sattu (roasted gram flour) filling and spices.",
    icon: <Sandwich className="w-8 h-8 text-amber-700" />,
  },
  {
    name: "Chana Chiwda",
    desc: "Roasted chickpea mix with flattened rice, peanuts, and spices—a crunchy namkeen favorite.",
    icon: <Apple className="w-8 h-8 text-amber-700" />,
  },
  {
    name: "Aloo Bhujia",
    desc: "Crispy potato noodles blended with signature spice mix—a beloved household snack.",
    icon: <Salad className="w-8 h-8 text-amber-700" />,
  },
  {
    name: "Tilkut",
    desc: "Sweet discs made from sesame seeds and jaggery, a must-have during Makar Sankranti.",
    icon: <Utensils className="w-8 h-8 text-amber-700" />,
  },
  {
    name: "Nimki",
    desc: "Crispy, savory diamond-shaped bites perfect for tea time.",
    icon: <Carrot className="w-8 h-8 text-amber-700" />,
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-amber-200 via-amber-100 to-orange-100 shadow-xl rounded-b-2xl mb-12">
        <div className="container flex flex-col items-center justify-center text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-amber-900 font-playfair drop-shadow-xl">
            Taste Bihar, Straight From Our Home Kitchen
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-amber-800 mb-7">
            Homemade Delights brings you truly authentic homemade snacks and sweets from the heart of Bihar, crafted with love and traditional recipes passed down through generations.
          </p>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg rounded-full px-8 py-4 font-semibold transition-all hover:scale-105">
            <Link to="/products">Explore Our Snacks</Link>
          </Button>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-20 container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-800 font-playfair">Our Story</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            From our small kitchen in Bihar to your table, Homemade Delights celebrates the soul of traditional Bihari snacks and sweets.
            Each recipe is lovingly prepared using premium, natural ingredients, just like at home. Whether you're looking to relive childhood flavors or experience the warmth of Bihari hospitality, we promise every bite is filled with nostalgia and honest goodness.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="px-6 py-2 bg-amber-200 text-amber-800 rounded-full text-sm font-bold shadow-sm">Made With Love</span>
            <span className="px-6 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-bold shadow-sm">Authentic Bihar Flavors</span>
            <span className="px-6 py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm font-bold shadow-sm">Fresh & Hygienic</span>
          </div>
        </div>

        {/* What Makes Us Special */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md text-center hover:scale-105 transition-all border border-amber-50">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="font-bold text-xl text-amber-900 mb-3 font-playfair">True Home Cooking</h3>
            <p className="text-muted-foreground">Everything is handmade in our own kitchen, not a factory—giving you that real homemade touch in every snack.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md text-center hover:scale-105 transition-all border border-amber-50">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cookie className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="font-bold text-xl text-amber-900 mb-3 font-playfair">Traditional Recipes</h3>
            <p className="text-muted-foreground">We stick to authentic recipes straight from Bihar, handed down generations—no artificial flavors, ever.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md text-center hover:scale-105 transition-all border border-amber-50">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="font-bold text-xl text-amber-900 mb-3 font-playfair">Warm Bihari Hospitality</h3>
            <p className="text-muted-foreground">Snacks here aren’t just food—they’re about warmth, sharing, and memories. We’re delighted to deliver a taste of home to your door.</p>
          </div>
        </div>
      </section>

      {/* Bihari Snacks Section */}
      <section className="container py-12 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-amber-800 font-playfair">Signature Bihari Snacks & Namkeen</h2>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
          {bihariSnacks.map((snack) => (
            <div
              key={snack.name}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-xl hover:-translate-y-2 transition-all border border-amber-50 group"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform">{snack.icon}</div>
              <div className="font-bold text-amber-900 text-lg mb-3 font-playfair">{snack.name}</div>
              <div className="text-muted-foreground text-sm leading-relaxed">{snack.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Homemade Section */}
      <section className="py-20 bg-amber-50/50 rounded-3xl mb-12 border border-amber-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
          <ChefHat size={120} />
        </div>

        <div className="container relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-900 font-playfair">Why Homemade?</h2>
            <p className="text-amber-800/70 font-medium">Our Promise to Your Family</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-amber-100 hover:shadow-xl hover:-translate-y-3 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                <ChefHat size={28} />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-3 font-playfair">100% Homemade</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Prepared with care in small batches, ensuring that authentic home-cooked flavor in every bite.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-amber-100 hover:shadow-xl hover:-translate-y-3 transition-all duration-300 group">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                <Leaf size={28} />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-3 font-playfair">No Preservatives</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Completely free from artificial chemicals and additives. Just natural ingredients you can trust.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-amber-100 hover:shadow-xl hover:-translate-y-3 transition-all duration-300 group">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-3 font-playfair">Freshly Prepared</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Made fresh to order to ensure the best possible taste and quality delivered to your doorstep.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-amber-100 hover:shadow-xl hover:-translate-y-3 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-3 font-playfair">Hygienic Kitchen</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Prepared in a clean and safe environment, following strict sanitization and hygiene protocols.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-amber-100 rounded-full text-sm font-semibold text-amber-700 shadow-sm hover:bg-amber-50 cursor-default transition-colors">
              <Zap size={16} className="text-amber-500 fill-amber-500" />
              <span>A promise of quality in every pack.</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
