import { Layout } from "@/components/Layout";
import { PaymentForm } from "@/components/PaymentForm";

const Payment = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Payment Details</h1>
          <PaymentForm />
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
