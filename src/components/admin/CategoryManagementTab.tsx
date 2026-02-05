
import React, { useState } from "react";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag, Trash2 } from "lucide-react";

export function CategoryManagementTab() {
    const { categories, addCategory } = useProducts();
    const [newCategory, setNewCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setIsSubmitting(true);
        await addCategory({ name: newCategory.trim() });
        setNewCategory("");
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
                <h3 className="text-xl font-bold text-amber-950 mb-6 flex items-center gap-2">
                    <Tag className="text-amber-600" size={20} />
                    Add New Category
                </h3>

                <form onSubmit={handleAddCategory} className="flex gap-4">
                    <div className="flex-grow">
                        <Input
                            placeholder="Enter category name (e.g., Seasonal Specials)"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="h-12 border-amber-100 focus:border-amber-300 rounded-xl"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isSubmitting || !newCategory.trim()}
                        className="h-12 px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg shadow-amber-200 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Category
                    </Button>
                </form>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
                <h3 className="text-xl font-bold text-amber-950 mb-6">Current Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100 group hover:border-amber-300 transition-colors"
                        >
                            <div>
                                <p className="font-bold text-amber-900">{category.name}</p>
                                <p className="text-xs text-amber-600 font-mono">{category.id}</p>
                            </div>
                            {/* Note: Delete might be complex due to product references, leaving as view-only for now */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
