import Cookies from "js-cookie";
import { ChangeEvent, useState, useEffect } from "react";
import axios from "../../utils/axios";
import { io } from "socket.io-client";

//FIXME: customer name not showing up

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL!, { autoConnect: false });

export default function OrdersTable({ orders }: { orders: any }) {
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

    socket.on("newOrderPlaced", (data: any) => {
      setOrdersState([...ordersState, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newOrderPlaced");
      socket.disconnect();
    };
  }, [ordersState]);

  const handleStatus = async (
    e: ChangeEvent<HTMLSelectElement>,
    order: any
  ) => {
    const status = e.target.value;
    const accessToken = Cookies.get("accessToken");

    const res = await axios.put(
      `/order/${order._id}`,
      { status },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const updatedOrder = res.data;
    socket.emit("changeOrderStatus", updatedOrder);
  };

  return (
    <>
      <label>
        <h3>Orders</h3>
        <p>{`socket connection: ${isSocketConnected}`}</p>
      </label>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Customer</th>
            <th scope="col">Total</th>
            <th scope="col">Payment Method</th>
            <th scope="col">Payment Status</th>
            <th scope="col">Order Status</th>
          </tr>
        </thead>

        <tbody>
          {ordersState.map((order: any) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user.name}</td>
              <td>{order.total}</td>
              <td>{order.payment.method}</td>
              <td>{order.payment.paymentStatus}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
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
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
