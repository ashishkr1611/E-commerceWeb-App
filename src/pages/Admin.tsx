import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    PlusCircle,
    Tag
} from "lucide-react";

// Modular Components
import { InventoryTab } from "@/components/admin/InventoryTab";
import { AddProductTab } from "@/components/admin/AddProductTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import { ReportsTab } from "@/components/admin/ReportsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { CategoryManagementTab } from "@/components/admin/CategoryManagementTab";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <Layout>
            <div className="container py-8 md:py-12">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold text-amber-950 mb-2">Boutique Owner Dashboard</h1>
                    <p className="text-amber-700/70">Manage your inventory, orders, and boutique growth from one central hub.</p>
                </header>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                        <TabsList className="bg-amber-50 border border-amber-100 p-1 h-auto">
                            <TabsTrigger
                                value="dashboard"
                                className="data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm px-4 py-2"
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                            </TabsTrigger>
                            <TabsTrigger
                                value="inventory"
                                className="data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm px-4 py-2"
                            >
                                <Package className="mr-2 h-4 w-4" /> Inventory
                            </TabsTrigger>
                            <TabsTrigger
                                value="add-product"
                                className="data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm px-4 py-2"
                            >
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                            </TabsTrigger>
                            <TabsTrigger
                                value="orders"
                                className="data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm px-4 py-2"
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" /> Orders
                            </TabsTrigger>

                            <TabsTrigger
                                value="users"
                                className="data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm px-4 py-2"
                            >
                                <Users className="mr-2 h-4 w-4" /> Users
                            </TabsTrigger>
                            <TabsTrigger
                                value="categories"
                                className="data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm px-4 py-2"
                            >
                                <Tag className="mr-2 h-4 w-4" /> Categories
                            </TabsTrigger>

                        </TabsList>
                    </div>

                    <TabsContent value="dashboard" className="space-y-6">
                        <ReportsTab />
                    </TabsContent>

                    <TabsContent value="inventory">
                        <InventoryTab onSwitchToAdd={() => setActiveTab("add-product")} />
                    </TabsContent>

                    <TabsContent value="add-product">
                        <AddProductTab onSuccess={() => setActiveTab("inventory")} />
                    </TabsContent>

                    <TabsContent value="orders">
                        <OrdersTab />
                    </TabsContent>

                    <TabsContent value="users">
                        <UsersTab />
                    </TabsContent>

                    <TabsContent value="categories">
                        <CategoryManagementTab />
                    </TabsContent>


                </Tabs>
            </div>
        </Layout>
    );
};

export default Admin;
