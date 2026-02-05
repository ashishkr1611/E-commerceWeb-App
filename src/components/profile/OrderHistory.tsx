
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { Order } from "@/lib/data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Package, Eye, Clock, CheckCircle2, Truck, PackageCheck, XCircle } from "lucide-react";
import { OrderTracking } from "@/components/profile/OrderTracking";

export const OrderHistory = () => {
    const { user } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
            toast({
                title: "Error",
                description: "Failed to load your order history.",
                variant: "destructive"
            });
        } else {
            const transformedOrders: Order[] = data.map(o => ({
                id: o.id,
                userId: o.user_id,
                totalAmount: o.total_amount,
                status: o.status as any,
                orderDetails: o.order_details,
                createdAt: o.created_at,
                statusHistory: o.status_history as any
            }));
            setOrders(transformedOrders);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
            case 'paid':
                return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Paid</Badge>;
            case 'shipped':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Shipped</Badge>;
            case 'delivered':
                return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Delivered</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Clock className="animate-spin h-8 w-8 text-amber-600" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-10 w-10 text-amber-200" />
                </div>
                <h3 className="text-lg font-bold text-amber-900 mb-1">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6">
                    When you place orders, they will appear here. Start exploring our snacks!
                </p>
                <Button className="bg-amber-600 hover:bg-amber-700">
                    Explore Snacks
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="overflow-hidden border border-amber-100 rounded-xl shadow-sm bg-white">
                <Table>
                    <TableHeader className="bg-amber-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-amber-900">Order ID</TableHead>
                            <TableHead className="font-bold text-amber-900">Date</TableHead>
                            <TableHead className="font-bold text-amber-900">Total</TableHead>
                            <TableHead className="font-bold text-amber-900">Status</TableHead>
                            <TableHead className="text-right font-bold text-amber-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-amber-50/30 transition-colors">
                                <TableCell className="font-mono text-xs text-muted-foreground max-w-[100px] truncate">
                                    {order.id}
                                </TableCell>
                                <TableCell className="text-sm font-medium">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="font-bold text-amber-800">
                                    ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(order.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 font-semibold"
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setIsTrackingOpen(true);
                                        }}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Track
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {selectedOrder && (
                <OrderTracking
                    isOpen={isTrackingOpen}
                    onClose={() => setIsTrackingOpen(false)}
                    order={selectedOrder}
                />
            )}
        </div>
    );
};
