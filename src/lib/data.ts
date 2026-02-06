export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  new: boolean;
  stock: number;
  images?: string[];
  isPublished?: boolean;
  isDeleted?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  orderDetails: any;
  createdAt: string;
  statusHistory?: { status: string; changedAt: string; changedBy: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}


export const products: Product[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Homemade Granola Clusters",
    price: 450,
    description: "Crunchy oat clusters with honey, nuts, and dried fruits. A perfect healthy snack for any time of day. Made with organic ingredients and no preservatives.",
    category: "healthy",
    imageUrl: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=2070",
    featured: true,
    new: false,
    stock: 10,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Artisanal Spiced Nuts Mix",
    price: 599,
    description: "A delicious blend of almonds, cashews, and pecans roasted with our special spice blend. Perfect for parties or as a protein-rich snack.",
    category: "savory",
    imageUrl: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=2070",
    featured: true,
    new: true,
    stock: 15,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Traditional Chocolate Chip Cookies",
    price: 350,
    description: "Soft and chewy chocolate chip cookies made with real butter and premium chocolate. Each batch is made by hand following our grandmother's recipe.",
    category: "sweet",
    imageUrl: "https://images.unsplash.com/photo-1499636138143-bd630f5cf386?q=80&w=2070",
    featured: false,
    new: true,
    stock: 8,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Cheese Crackers With Herbs",
    price: 250,
    description: "Crispy, cheesy crackers seasoned with fresh herbs from our garden. Perfect for snacking or serving with your favorite dips.",
    category: "savory",
    imageUrl: "https://images.unsplash.com/photo-1651695635284-a1563bb112d1?q=80&w=2071",
    featured: true,
    new: false,
    stock: 20,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "Handcrafted Caramel Popcorn",
    price: 199,
    description: "Sweet and crunchy popcorn coated in our homemade caramel sauce. A classic treat made with love and natural ingredients.",
    category: "sweet",
    imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=2070",
    featured: false,
    new: true,
    stock: 25,
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    name: "Seasonal Fruit & Nut Bars",
    price: 499,
    description: "Chewy fruit and nut bars made with seasonal dried fruits, nuts, and seeds. A nutritious energy-boosting snack for any time of day.",
    category: "healthy",
    imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=2074",
    featured: true,
    new: false,
    stock: 12,
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    name: "Assorted Snack Gift Box",
    price: 1499,
    description: "A curated selection of our most popular snacks packaged in a beautiful gift box. Perfect for gifting to friends, family, or as a corporate present.",
    category: "gift",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070",
    featured: false,
    new: true,
    stock: 5,
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    name: "Spicy Roasted Chickpeas",
    price: 150,
    description: "Crunchy roasted chickpeas with a kick of spice. A protein-packed snack that's both satisfying and healthy.",
    category: "savory",
    imageUrl: "https://images.unsplash.com/photo-1541533848490-bc8115cd6522?q=80&w=2070",
    featured: true,
    new: true,
    stock: 30,
  },
  {
    id: "00000000-0000-0000-0000-000000000009",
    name: "Classic Namkeen Mixture",
    price: 220,
    description: "A savory blend of crunchy besan, peanuts, sev, and spices—authentic Indian tea-time mix, made fresh in small batches.",
    category: "savory",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070",
    featured: true,
    new: true,
    stock: 18,
  },
  {
    id: "00000000-0000-0000-0000-000000000010",
    name: "Homestyle Shakarpara",
    price: 180,
    description: "Sweet, crunchy bites coated with a delicate sugar glaze, perfect for festivals and family gatherings.",
    category: "sweet",
    imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=2070",
    featured: false,
    new: true,
    stock: 12,
  },
  {
    id: "00000000-0000-0000-0000-000000000011",
    name: "Spicy Mathri Crackers",
    price: 190,
    description: "Traditional flaky mathri seasoned with a hint of chili and cumin. Enjoy with chai or as an anytime treat.",
    category: "savory",
    imageUrl: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?q=80&w=2070",
    featured: false,
    new: true,
    stock: 14,
  },
  {
    id: "00000000-0000-0000-0000-000000000012",
    name: "Gud Chikki (Peanut Brittle)",
    price: 160,
    description: "Classic Indian peanut brittle made with jaggery and roasted peanuts. Naturally sweet, guilt-free snack.",
    category: "healthy",
    imageUrl: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=2070",
    featured: true,
    new: true,
    stock: 22,
  },
  {
    id: "00000000-0000-0000-0000-000000000013",
    name: "Fresh Coconut Ladoo",
    price: 320,
    description: "Soft, melt-in-mouth coconut laddus made with fresh coconut and condensed milk—hand-rolled for perfect taste.",
    category: "sweet",
    imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=1920",
    featured: false,
    new: false,
    stock: 10,
  },
  {
    id: "00000000-0000-0000-0000-000000000014",
    name: "Roasted Masala Makhana",
    price: 240,
    description: "Crispy roasted foxnuts (makhana) tossed with house-blend masala. Gluten-free healthy snack for all ages.",
    category: "healthy",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920",
    featured: false,
    new: true,
    stock: 16,
  },
  {
    id: "00000000-0000-0000-0000-000000000015",
    name: "Matcha Green Tea Bliss Bits",
    price: 380,
    description: "Healthy energy bites made with organic ceremonial grade matcha, dates, and almonds. A refreshing, antioxidant-rich mid-day snack.",
    category: "healthy",
    imageUrl: "https://images.unsplash.com/photo-1515823149245-75c0eb0183ca?q=80&w=2070",
    featured: true,
    new: true,
    stock: 20,
  },
  {
    id: "00000000-0000-0000-0000-000000000016",
    name: "Smoked Paprika Makhana",
    price: 260,
    description: "Crunchy foxnuts roasted with premium smoked paprika and Himalayan salt. A sophisticated savory snack that is light yet full of flavor.",
    category: "savory",
    imageUrl: "https://images.unsplash.com/photo-1613919113166-291732958046?q=80&w=2070",
    featured: false,
    new: true,
    stock: 25,
  },
  {
    id: "00000000-0000-0000-0000-000000000017",
    name: "Dark Chocolate & Sea Salt Bark",
    price: 550,
    description: "Rich 70% dark chocolate shards sprinkled with hand-harvested sea salt and toasted pistachios. The perfect balance of sweet and salty.",
    category: "sweet",
    imageUrl: "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=2070",
    featured: true,
    new: true,
    stock: 14,
  },
  {
    id: "00000000-0000-0000-0000-000000000018",
    name: "Zesty Lemon & Ginger Shorts",
    price: 320,
    description: "Shortbread cookies with a bright lemon zest and a gingery kick. These melt-in-the-mouth biscuits are perfect with a cup of warm tea.",
    category: "sweet",
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=2070",
    featured: false,
    new: true,
    stock: 18,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products;
  return products.filter(product => product.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}

export function getNewProducts(): Product[] {
  return products.filter(product => product.new);
}
