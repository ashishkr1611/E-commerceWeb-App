import { Layout } from "@/components/Layout";
import { Cart as CartComponent } from "@/components/Cart";

const Cart = () => {
  return (
    <Layout>
      <div className="container py-8">
        <CartComponent />
      </div>
    </Layout>
  );
};

export default Cart;
