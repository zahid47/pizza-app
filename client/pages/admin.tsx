import { GetServerSideProps } from "next";
import axios from "../utils/axios";

export default function admin({
  orders,
  products,
}: {
  orders: any;
  products: any;
}) {
  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order: any) => (
          <li key={order._id}>{order._id} - {order.status}</li>
        ))}
      </ul>
      <h1>Products</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product._id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessToken = context.req.cookies.accessToken;

  const ordersResponse = await axios.get("/order", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const productsResponse = await axios.get("/product", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const orders = ordersResponse.data;
  const products = productsResponse.data;

  return {
    props: {
      orders,
      products,
    },
  };
};
