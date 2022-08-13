//TODO: add individual page for each order

import axios from "../../utils/axios";
import { GetServerSideProps } from "next";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import styles from "../../styles/Orders.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function Orders({ orders }: any) {
  const socket = io(process.env.NEXT_PUBLIC_SERVER_URL!);
  const [ordersState, setOrdersState] = useState<any>(orders);
  dayjs.extend(relativeTime);

  useEffect(() => {
    setOrdersState(orders);
  }, [orders]);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {});
    socket.on("disconnect", () => {});

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
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {ordersState &&
                ordersState.reverse().map((order: any) => {
                  return (
                    <tr key={order._id}>
                      <td className={styles.td}>{order._id}</td>
                      {/* FIXME */}
                      <td className={styles.td}>{JSON.stringify({})}</td>
                      <td className={styles.td}>{order.total}</td>
                      <td className={styles.td}>
                        {dayjs(order.createdAt).fromNow()}
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
