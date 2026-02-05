
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "@/lib/data";
import { CheckCircle2, Clock, Truck, PackageCheck, MapPin, Receipt, Package, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface OrderTrackingProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
}

export const OrderTracking = ({ isOpen, onClose, order }: OrderTrackingProps) => {
    const statusSteps = [
        { status: 'pending', label: 'Order Placed', icon: Clock, desc: 'We have received your order' },
        { status: 'paid', label: 'Processing', icon: CheckCircle2, desc: 'Your snacks are being prepared' },
        { status: 'shipped', label: 'On the Way', icon: Truck, desc: 'Your order is out for delivery' },
        { status: 'delivered', label: 'Delivered', icon: PackageCheck, desc: 'Enjoy your homemade delights!' },
    ];

    const getCurrentStep = () => {
        const status = order.status;
        if (status === 'cancelled') return -1;
        const index = statusSteps.findIndex(s => s.status === status);
        return index !== -1 ? index : 0;
    };

    const currentStep = getCurrentStep();
    const shipping = order.orderDetails?.shipping || {};
    const items = order.orderDetails?.items || [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-amber-100 shadow-2xl">
                <DialogHeader>
                    <div className="flex flex-col gap-1">
                        <DialogTitle className="text-2xl font-playfair font-bold text-amber-900">Track Order</DialogTitle>
                        <DialogDescription className="font-mono text-xs text-amber-700/60">
                            Order ID: #{order.id}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="mt-8 space-y-10">
                    {/* Visual Tracking Stepper */}
                    <div className="relative">
                        <div className="absolute left-[27px] top-0 bottom-0 w-1 bg-amber-100 rounded-full" />
                        <div className="space-y-8">
                            {statusSteps.map((step, index) => {
                                const isCompleted = index <= currentStep;
                                const isCurrent = index === currentStep;
                                const Icon = step.icon;

                                return (
                                    <div key={step.status} className="flex gap-6 relative group">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 border-2 shadow-sm",
                                            isCompleted
                                                ? "bg-emerald-600 border-emerald-500 text-white scale-110"
                                                : "bg-white border-amber-100 text-amber-200"
                                        )}>
                                            <Icon size={24} className={cn(isCurrent && "animate-pulse")} />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className={cn(
                                                "font-bold text-lg leading-tight transition-colors",
                                                isCompleted ? "text-emerald-900" : "text-amber-200"
                                            )}>
                                                {step.label}
                                            </h4>
                                            <p className={cn(
                                                "text-sm",
                                                isCompleted ? "text-emerald-700/70" : "text-amber-100"
                                            )}>
                                                {isCurrent ? step.desc : isCompleted ? "Completed" : "Awaiting..."}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Separator className="bg-amber-100/50" />

                    {/* Order Details Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-bold text-amber-900 flex items-center gap-2">
                                <MapPin size={18} className="text-amber-500" />
                                Delivery Address
                            </h4>
                            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-sm text-amber-900/80 leading-relaxed shadow-inner">
                                <p className="font-bold">{shipping.firstName} {shipping.lastName}</p>
                                <p>{shipping.address}</p>
                                <p>{shipping.city}, {shipping.pinCode}</p>
                                <p className="mt-2 text-xs text-amber-700 font-medium">Phone: {shipping.phone}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-amber-900 flex items-center gap-2">
                                <Receipt size={18} className="text-amber-500" />
                                Order Summary
                            </h4>
                            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-3 shadow-inner">
                                <div className="space-y-1 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between text-sm items-center py-1 border-b border-amber-100/50 last:border-0">
                                            <span className="text-amber-900/80 line-clamp-1 flex-grow pr-4">{item.name} <span className="text-xs text-amber-500 font-bold mx-1">×</span> {item.quantity}</span>
                                            <span className="font-mono font-medium text-amber-700">₹{(item.price * item.quantity).toFixed(0)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2 border-t border-amber-200">
                                    <div className="flex justify-between font-bold text-amber-900">
                                        <span>Total Paid</span>
                                        <span className="text-lg">₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-4 border border-emerald-100">
                        <div className="bg-white p-3 rounded-xl shadow-sm">
                            <Package className="text-emerald-600" size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-emerald-800/60 font-bold uppercase tracking-wider">Need assistance?</p>
                            <p className="text-sm text-emerald-900 font-medium">Contact us at <span className="font-bold underline decoration-emerald-300">support@homemadedelights.com</span></p>
                        </div>
                        <ChevronRight className="ml-auto text-emerald-300" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
