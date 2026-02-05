import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Truck } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";

const PaymentSuccess = () => {
  const location = useLocation();

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
              <CheckCircle className="text-green-600 h-12 w-12" />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold mb-4 text-amber-900 font-playfair">Thank You For Your Order!</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Your order has been placed and is being prepared with love. You will receive an email
            confirmation shortly at your registered email address.
          </p>

          <div className="bg-white/80 backdrop-blur-sm border border-amber-100 p-8 rounded-2xl shadow-md mb-10">
            <h2 className="font-bold text-amber-900 mb-6 text-xl">Order Summary</h2>
            <div className="grid grid-cols-2 gap-y-4 text-base">
              <div className="text-left text-muted-foreground">Order Number:</div>
              <div className="text-right font-bold text-amber-800">
                {location.state?.orderId ? `#HMD-${location.state.orderId.substring(0, 8).toUpperCase()}` : `#HMD${Math.floor(100000 + Math.random() * 900000)}`}
              </div>

              <div className="text-left text-muted-foreground">Status:</div>
              <div className="text-right font-bold text-emerald-600">Pending</div>

              <div className="text-left text-muted-foreground">Date:</div>
              <div className="text-right font-medium">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 px-8 py-6 rounded-full text-lg shadow-md transition-all hover:scale-105">
              <Link to="/profile" className="flex items-center gap-2">
                <Truck size={20} />
                Track My Order
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-amber-200 text-amber-800 px-8 py-6 rounded-full text-lg shadow-sm hover:bg-amber-50 transition-all hover:scale-105">
              <Link to="/products" className="flex items-center gap-2">
                <ShoppingBag size={20} />
                Explore More Snacks
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
