
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Eye, CheckCircle2, Truck, PackageCheck, XCircle, Clock } from "lucide-react";
import { OrderDetailsDialog } from "./OrderDetailsDialog";

export const OrdersTab = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                profiles (
                    full_name,
                    email
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to load orders.",
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
                statusHistory: o.status_history as any,
                customerName: (o.profiles as any)?.full_name || (o.profiles as any)?.email || "Unknown"
            }));
            setOrders(transformedOrders);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            toast({
                title: "Error",
                description: "Failed to update order status.",
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: `Order status updated to ${newStatus}.`,
            });
            fetchOrders();
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-4 w-4 text-amber-600" />;
            case 'paid': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case 'shipped': return <Truck className="h-4 w-4 text-amber-500" />;
            case 'delivered': return <PackageCheck className="h-4 w-4 text-blue-500" />;
            case 'cancelled': return <XCircle className="h-4 w-4 text-rose-500" />;
            default: return <Clock className="h-4 w-4 text-gray-400" />;
        }
    };

    return (
        <Card className="border-amber-100 shadow-sm">
            <CardHeader>
                <CardTitle>Global Order Management</CardTitle>
                <CardDescription>View all orders and update their delivery lifecycle.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading orders...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs max-w-[120px] truncate">
                                        {order.id}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[150px] truncate" title={order.userId}>
                                            {(order as any).customerName || order.userId}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-amber-900">
                                        ₹{order.totalAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onValueChange={(val) => updateOrderStatus(order.id, val)}
                                        >
                                            <SelectTrigger className="w-[130px] h-8">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(order.status)}
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setIsDetailsOpen(true);
                                            }}
                                        >
                                            <Eye className="mr-2 h-4 w-4" /> Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <OrderDetailsDialog
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                order={selectedOrder}
            />
        </Card>
    );
};
