//TODO: add individual page for each order

import axios from "../../utils/axios";
import { GetServerSideProps } from "next";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import styles from "../../styles/Orders.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useCartStore from "../../context/cartStore";
import { useRouter } from "next/router";

export default function Orders({ orders }: any) {
  const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);
  const [ordersState, setOrdersState] = useState<any>(orders);
  const { clearCart } = useCartStore((state) => state);
  const router = useRouter();
  dayjs.extend(relativeTime);

  useEffect(() => {
    if (router.query.success === "true") {
      clearCart();
    }
  }, []);

  useEffect(() => {
    setOrdersState(orders);
  }, [orders]);

  useEffect(() => {
    socket.connect();

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
      socket.off("orderStatusChanged");
      socket.disconnect();
    };
  }, [ordersState, socket]);

  return (
    <div className={styles.container}>
      {ordersState && ordersState.length <= 0 ? (
        <p className={styles.noOrders}>You have no orders (yet!!)</p>
      ) : (
        <>
          <table className={styles.table}>
            <caption className={styles.caption}>Your Orders</caption>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Order ID</th>
                <th className={styles.th}>Products</th>
                <th className={styles.th}>Total</th>
                <th className={styles.th}>Time</th>
                <th className={styles.th}>Payment</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {ordersState &&
                ordersState.reverse().map((order: any) => {
                  return (
                    <tr key={order._id}>
                      <td className={styles.td}>{order._id}</td>
                      <td className={styles.td}>
                        {order.products.map((product: any) => {
                          return (
                            <p
                              key={product._id}
                            >{`${product.product.name} - ${product.option}`}</p>
                          );
                        })}
                      </td>
                      <td className={styles.td}>{order.total}</td>
                      <td className={styles.td}>
                        {dayjs(order.createdAt).fromNow()}
                      </td>
                      <td className={styles.td}>
                        {order.payment.paymentStatus}
                      </td>
                      <td className={styles.td}>{order.status}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
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
