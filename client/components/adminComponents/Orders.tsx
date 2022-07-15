import Cookies from "js-cookie";
import { ChangeEvent } from "react";
import axios from "../../utils/axios";

export default function OrdersTable({ orders }: { orders: any }) {
  const handleStatus = async (
    e: ChangeEvent<HTMLSelectElement>,
    order: any
  ) => {
    const status = e.target.value;
    const accessToken = Cookies.get("accessToken");

    await axios.put(
      `/order/${order._id}`,
      { status },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  };

  return (
    <>
      <label>
        <h3>Orders</h3>
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
          {orders.map((order: any) => (
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
