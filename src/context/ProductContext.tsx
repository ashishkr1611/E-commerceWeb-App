
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category, products as initialProducts } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductContextType {
    products: Product[];
    categories: Category[];
    addProduct: (product: Omit<Product, "id">) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProductById: (id: string) => Product | undefined;
    getProductsByCategory: (category: string) => Product[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    refreshProducts: () => Promise<void>;
    uploadImage: (file: File) => Promise<string | null>;
    addCategory: (category: Omit<Category, "id">) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProducts = async () => {
        try {
            // First try a simple select to see what's available
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) throw error;

            if (data && data.length > 0) {
                const mappedProducts: Product[] = data
                    .filter(p => p.is_deleted === false || p.is_deleted === undefined) // Safe filter
                    .map(p => {
                        const images = (p.images as string[]) || [];
                        return {
                            id: p.id,
                            name: p.name,
                            price: Number(p.price),
                            description: p.description || "",
                            category: p.category || "all",
                            imageUrl: p.image_url || (images.length > 0 ? images[0] : ""),
                            featured: p.is_featured || false,
                            new: p.is_new || false,
                            stock: p.stock || 0,
                            images: images,
                            isPublished: p.is_published ?? true,
                            isDeleted: p.is_deleted ?? false
                        };
                    });
                setProducts(mappedProducts);
            } else {
                setProducts(initialProducts);
            }
        } catch (error) {
            console.error("Failed to fetch products from Supabase:", error);
            const storedProducts = localStorage.getItem("products");
            if (storedProducts) {
                try {
                    setProducts(JSON.parse(storedProducts));
                } catch (e) {
                    setProducts(initialProducts);
                }
            } else {
                setProducts(initialProducts);
            }
        }
    };

    const fetchCategories = async () => {
        try {
            const { data, error } = await (supabase as any)
                .from('categories')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            if (data) setCategories(data);
        } catch (error: any) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem("products", JSON.stringify(products));
        }
    }, [products]);

    const addProduct = async (newProductData: Omit<Product, "id">) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([{
                    name: newProductData.name,
                    price: newProductData.price,
                    description: newProductData.description,
                    category: newProductData.category,
                    image_url: newProductData.imageUrl,
                    is_featured: newProductData.featured,
                    is_new: newProductData.new,
                    stock: newProductData.stock,
                    images: newProductData.images || [],
                    is_published: newProductData.isPublished ?? true
                }])
                .select();

            if (error) throw error;

            await fetchProducts();
            toast({
                title: "Product Added",
                description: `${newProductData.name} has been added to the store.`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add product.",
                variant: "destructive"
            });
        }
    };

    const updateProduct = async (id: string, updatedData: Partial<Product>) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({
                    name: updatedData.name,
                    price: updatedData.price,
                    description: updatedData.description,
                    category: updatedData.category,
                    image_url: updatedData.imageUrl,
                    is_featured: updatedData.featured,
                    is_new: updatedData.new,
                    stock: updatedData.stock,
                    images: updatedData.images,
                    is_published: updatedData.isPublished,
                    is_deleted: updatedData.isDeleted
                })
                .eq('id', id);

            if (error) throw error;

            await fetchProducts();
            toast({
                title: "Product Updated",
                description: "Changes have been saved successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update product.",
                variant: "destructive"
            });
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            // Soft delete
            const { error } = await supabase
                .from('products')
                .update({ is_deleted: true })
                .eq('id', id);

            if (error) throw error;

            await fetchProducts();
            toast({
                title: "Product Deleted",
                description: "The product has been removed from the store.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete product.",
                variant: "destructive"
            });
        }
    };

    const getProductById = (id: string) => {
        return products.find((p) => p.id === id);
    };

    const getProductsByCategory = (category: string) => {
        if (category === "all") return products;
        return products.filter((p) => p.category === category);
    };

    const addCategory = async (category: Omit<Category, "id">) => {
        try {
            const categoryId = category.name.toLowerCase().replace(/\s+/g, '-');
            const { error } = await (supabase as any)
                .from('categories')
                .insert([{ id: categoryId, name: category.name }]);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Category added successfully!",
            });
            fetchCategories();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add category.",
                variant: "destructive",
            });
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error: any) {
            console.error("Error uploading image:", error);
            toast({
                title: "Upload Failed",
                description: error.message || "Failed to upload image.",
                variant: "destructive"
            });
            return null;
        }
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                categories,
                addProduct,
                updateProduct,
                deleteProduct,
                getProductById,
                getProductsByCategory,
                searchQuery,
                setSearchQuery,
                refreshProducts: fetchProducts,
                uploadImage,
                addCategory
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}
