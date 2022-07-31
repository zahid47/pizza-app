import useCartStore from "../zustand/cartStore";
import { useState, useEffect, MouseEvent, useCallback } from "react";
import axios from "../utils/axios";
import Cookies from "js-cookie";
import NavBar from "../components/NavBar";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", { autoConnect: false });

export default function Cart() {
  const router = useRouter();

  const { cartContent, removeFromCart } = useCartStore((state) => state);
  const [cartContentState, setCartContentState] = useState<any>();
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setCartContentState(cartContent);
  }, [cartContent]);

  const calculateTotal = useCallback(() => {
    let total = 0;
    cartContentState &&
      cartContentState.forEach((item: any) => {
        total += item.price * item.quantity;
      });
    return total;
  }, [cartContentState]);

  const [total, setTotal] = useState(calculateTotal());

  useEffect(() => {
    setTotal(calculateTotal());
  }, [calculateTotal]);

  const handleRemove = (
    _e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    productId: string
  ) => {
    removeFromCart(productId);
    setCartContentState(cartContent);
    setTotal(calculateTotal());
  };

  const handleOrder = async () => {
    const products =
      cartContentState &&
      cartContentState.map((item: any) => {
        return {
          product: item.id,
          variant: "small", //FIXME: hardcoded
          quantity: item.quantity,
        };
      });

    const orderDetails = {
      products,
      payment: {
        method: "card",
      },
      total,
    };

    const accessToken = Cookies.get("accessToken");
    const res = await axios.post("/order", orderDetails, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const order = res.data;
    socket.emit("newOrder", order);
    router.push("/checkout");
  };

  return (
    <>
      <NavBar />
      <p>{`socket connection: ${isSocketConnected}`}</p>
      {cartContentState && cartContentState.length < 1 ? (
        <div>No items in cart</div>
      ) : (
        <>
          <label>
            <h3>Cart</h3>
          </label>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartContentState &&
                cartContentState.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price * item.quantity}</td>
                    <td>
                      <button
                        onClick={(e) => handleRemove(e, item.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <h1>Total: {total} BDT</h1>
          <button
            className="btn btn-dark"
            style={{ width: "20%" }}
            onClick={handleOrder}
          >
            Go To Checkout
          </button>
        </>
      )}
    </>
  );
}
