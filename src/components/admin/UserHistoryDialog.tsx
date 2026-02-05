import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Order } from "@/lib/data";

interface UserHistoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
    userName: string;
}

export const UserHistoryDialog = ({ isOpen, onClose, userId, userName }: UserHistoryDialogProps) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserOrders(userId);
        }
    }, [isOpen, userId]);

    const fetchUserOrders = async (uid: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', uid)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data.map(o => ({
                id: o.id,
                userId: o.user_id,
                totalAmount: o.total_amount,
                status: o.status as any,
                orderDetails: o.order_details,
                createdAt: o.created_at,
                statusHistory: o.status_history as any
            })));
        }
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'delivered': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
            default: return 'bg-amber-100 text-amber-800 border-amber-200';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order History: {userName}</DialogTitle>
                    <DialogDescription>
                        View all past orders for this customer.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                        </div>
                    ) : orders.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {order.id.slice(0, 8)}...
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            ₹{order.totalAmount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(order.status)} variant="outline">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                            No orders found for this user.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
