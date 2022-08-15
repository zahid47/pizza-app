import Cookies from "js-cookie";
import { MouseEvent, ChangeEvent, useState, useEffect } from "react";
import axios from "../../utils/axios";
import { io } from "socket.io-client";
import styles from "../../styles/Admin.Orders.module.css";

export default function OrdersTable({ orders }: { orders: any }) {
  const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);
  const [ordersState, setOrdersState] = useState<any>(orders);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    setOrdersState(orders);
  }, [orders]);

  useEffect(() => {
    socket.connect();

    socket.on("newOrderPlaced", (data: any) => {
      setOrdersState([data, ...ordersState]);
    });

    return () => {
      socket.off("newOrderPlaced");
      socket.disconnect();
    };
  }, [ordersState, socket]);

  const handleStatus = async (
    e: ChangeEvent<HTMLSelectElement>,
    order: any
  ) => {
    const status = e.target.value;
    const accessToken = Cookies.get("accessToken");

    try {
      const res = await axios.put(
        `/order/${order._id}`,
        { status },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const updatedOrder = res.data;
      socket.emit("changeOrderStatus", updatedOrder);
    } catch {
      alert("Could not update order status");
    }
  };

  const deleteOrder = async (
    _e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    orderId: string
  ) => {
    setDeleting(true);

    const accessToken = Cookies.get("accessToken");

    try {
      await axios.delete(`/order/${orderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setOrdersState(ordersState.filter((order: any) => order._id !== orderId));
    } catch {
      alert("Could not delete order");
    }

    setDeleting(false);
  };

  return (
    <>
      {ordersState && ordersState.length <= 0 ? (
        <p className={styles.noItems}>No orders (yet!!)</p>
      ) : (
        <table className={styles.table}>
          <caption className={styles.caption}>Orders</caption>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.td}>Order ID</th>
              <th className={styles.td}>Customer</th>
              <th className={styles.td}>Products</th>
              <th className={styles.td}>Total</th>
              <th className={styles.td}>Payment Method</th>
              <th className={styles.td}>Payment Status</th>
              <th className={styles.td}>Order Status</th>
              <th className={styles.td}>Delete</th>
            </tr>
          </thead>

          <tbody className={styles.tbody}>
            {ordersState &&
              ordersState.reverse().map((order: any) => (
                <tr key={order._id}>
                  <td className={styles.td}>{order._id}</td>
                  <td className={styles.td}>{order.user.name}</td>
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
                  <td className={styles.td}>{order.payment.method}</td>
                  <td className={styles.td}>{order.payment.paymentStatus}</td>
                  <td className={styles.td}>
                    <select
                      className={styles.dropdown}
                      onChange={async (e) => {
                        await handleStatus(e, order);
                      }}
                      defaultValue={order.status}
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cooking">cooking</option>
                      <option value="on the way">on the way</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className={styles.td}>
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        deleteOrder(e, order._id);
                      }}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
}
