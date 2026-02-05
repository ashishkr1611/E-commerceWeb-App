import React from "react";
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
import { Order } from "@/lib/data";
import { User, MapPin, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrderDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export const OrderDetailsDialog = ({ isOpen, onClose, order }: OrderDetailsDialogProps) => {
    if (!order) return null;

    // Safely extract details, handling potential missing data
    const items = order.orderDetails?.items || [];
    const shipping = order.orderDetails?.shipping || {};
    const hasShippingInfo = Object.keys(shipping).length > 0;

    // Calculate subtotal from items if possible, or fallback
    const calculatedSubtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const tax = calculatedSubtotal * 0.05;

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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-start pr-8">
                        <div>
                            <DialogTitle className="text-xl">Order Details</DialogTitle>
                            <DialogDescription className="font-mono text-xs mt-1">
                                #{order.id}
                            </DialogDescription>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} capitalize`} variant="outline">
                            {order.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Customer & Shipping Info */}
                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-amber-50/50 rounded-lg border border-amber-100">
                        <div>
                            <h4 className="font-semibold text-amber-900 mb-2 flex items-center text-sm">
                                <User size={14} className="mr-2" /> Customer Info
                            </h4>
                            <div className="text-sm space-y-1">
                                <p className="font-medium">{(order as any).customerName}</p>
                                <p className="text-muted-foreground text-xs">{order.userId}</p>
                            </div>
                        </div>
                        {hasShippingInfo && (
                            <div>
                                <h4 className="font-semibold text-amber-900 mb-2 flex items-center text-sm">
                                    <MapPin size={14} className="mr-2" /> Shipping Address
                                </h4>
                                <div className="text-sm space-y-1 text-amber-900/80">
                                    <p>{shipping.firstName} {shipping.lastName}</p>
                                    <p>{shipping.address}</p>
                                    <p>{shipping.city} - {shipping.pinCode}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                        <span className="flex items-center"><Phone size={10} className="mr-1" /> {shipping.phone}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div>
                        <h4 className="font-semibold mb-3">Items Ordered</h4>
                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right">₹{item.price}</TableCell>
                                            <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                No specific item details found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{calculatedSubtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax (GST 5%)</span>
                            <span>₹{tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-emerald-600 font-medium">Free</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-amber-700">₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
