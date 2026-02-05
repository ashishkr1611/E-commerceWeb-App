
import React from "react";
import { useProducts } from "@/context/ProductContext";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Package, BarChart3, AlertTriangle, X } from "lucide-react";

export const ReportsTab = () => {
    const { products, categories } = useProducts();

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-amber-100 shadow-sm bg-gradient-to-br from-white to-amber-50">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-amber-800">Total Items in Stock</CardTitle>
                            <Package className="h-4 w-4 text-amber-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-950">
                            {products.reduce((acc, p) => acc + p.stock, 0)}
                        </div>
                        <p className="text-xs text-amber-700/60 mt-1">Across all categories</p>
                    </CardContent>
                </Card>

                <Card className="border-rose-100 shadow-sm bg-gradient-to-br from-white to-rose-50">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-rose-800">Low Stock Alerts</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-rose-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-950">
                            {products.filter(p => p.stock < 5 && p.stock > 0).length}
                        </div>
                        <p className="text-xs text-rose-700/60 mt-1">Items with less than 5 units</p>
                    </CardContent>
                </Card>

                <Card className="border-teal-100 shadow-sm bg-gradient-to-br from-white to-teal-50">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-teal-800">Out of Stock</CardTitle>
                            <X className="h-4 w-4 text-teal-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-teal-950">
                            {products.filter(p => p.stock === 0).length}
                        </div>
                        <p className="text-xs text-teal-700/60 mt-1">Needs immediate restocking</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-amber-100 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-amber-600" />
                        Category Wise Inventory
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {categories.filter(c => c.id !== "all").map(category => {
                            const categoryProducts = products.filter(p => p.category === category.id);
                            const totalStock = categoryProducts.reduce((acc, p) => acc + p.stock, 0);
                            const maxStock = products.reduce((acc, p) => acc + p.stock, 0) || 1;
                            const percentage = (totalStock / maxStock) * 100;

                            return (
                                <div key={category.id} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-amber-900">{category.name}</span>
                                        <span className="text-amber-700 font-bold">{totalStock} units</span>
                                    </div>
                                    <div className="w-full bg-amber-100 rounded-full h-2">
                                        <div
                                            className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.max(percentage, 5)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
