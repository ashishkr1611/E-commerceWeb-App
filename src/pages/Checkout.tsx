import { Layout } from "@/components/Layout";
import { CheckoutForm } from "@/components/CheckoutForm";

const Checkout = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <CheckoutForm />
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
