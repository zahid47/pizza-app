import axios from "../utils/axios";
import { GetServerSideProps } from "next";
import NavBar from "../components/NavBar";

export default function Orders({ orders }: { orders: any }) {
  return (
    <div>
      <NavBar />
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order: any) => (
            <li key={order._id}>
              {order._id} - {order.total} - {order.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no orders (yet!!)</p>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessToken = context.req.cookies.accessToken;

  const res = await axios.get("/user/orders", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const orders = res.data;

  return {
    props: {
      orders,
    },
  };
};
