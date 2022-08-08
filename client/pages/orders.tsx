//TODO: add individual page for each order

import axios from "../utils/axios";
import { GetServerSideProps } from "next";
import NavBar from "../components/NavBar";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL, { autoConnect: false });

export default function Orders({ orders }: { orders: any }) {
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
  const [ordersState, setOrdersState] = useState<any>(orders);

  useEffect(() => {
    setOrdersState(orders);
  }, [orders]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    socket.on("orderStatusChanged", (order: any) => {
      setOrdersState(
        ordersState.map((ordr: any) => {
          if (ordr._id === order._id) {
            return order;
          }
          return ordr;
        })
      );
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("orderStatusChanged");
      socket.disconnect();
    };
  }, [ordersState]);
  return (
    <div>
      <NavBar />
      <h1>Your Orders</h1>
      <p>{`socket connection: ${isSocketConnected}`}</p>
      {ordersState.length > 0 ? (
        <ul>
          {ordersState.map((order: any) => (
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
