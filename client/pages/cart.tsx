import useCartStore from "../context/cartStore";
import { useEffect, MouseEvent, useCallback } from "react";
import axios from "../utils/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import styles from "../styles/Cart.module.css";

export default function Cart() {
  const socket = io(process.env.NEXT_PUBLIC_SERVER_URL!);
  const router = useRouter();
  const {
    cartContent,
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
    cartTotal,
    setCartTotal,
  } = useCartStore((state) => state);

  const calculateTotal = useCallback(() => {
    let total = 0;
    cartContent &&
      cartContent.forEach((item: any) => {
        total += item.price * item.quantity;
      });
    return total;
  }, [cartContent]);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {});
    socket.on("disconnect", () => {});

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setCartTotal(calculateTotal());
  }, [calculateTotal, setCartTotal]);

  const incrementQty = (
    _e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    productId: string
  ) => {
    addToCart(productId);
    setCartTotal(calculateTotal());
  };

  const decrementQty = (
    _e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    productId: string
  ) => {
    removeFromCart(productId);
    setCartTotal(calculateTotal());
  };

  const handleDelete = (
    _e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    product: string
  ) => {
    deleteFromCart(product);
    setCartTotal(calculateTotal());
  };

  const handleOrder = async () => {
    const products =
      cartContent &&
      cartContent.map((item: any) => {
        return {
          product: item.id,
          option: item.option,
          quantity: item.quantity,
        };
      });

    const orderDetails = {
      products,
      payment: {
        method: "card",
      },
      total: cartTotal,
    };

    const accessToken = Cookies.get("accessToken");
    const res = await axios.post("/order", orderDetails, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const order = res.data;
    socket.emit("newOrder", order);
    clearCart();
    alert("Order placed successfully");
    router.push("/orders");
  };

  return (
    <div className={styles.container}>
      {cartContent && cartContent.length <= 0 ? (
        <div className={styles.noitems}>Cart is empty</div>
      ) : (
        <>
          <table className={styles.table}>
            <caption className={styles.caption}>Your Cart</caption>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Option</th>
                <th className={styles.th}>Quantity</th>
                <th className={styles.th}>Price</th>
                <th className={styles.th}>Remove</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {cartContent.map((item: any) => (
                <tr key={`${item.option}-${item.id}`}>
                  <td className={styles.td}>{item.name}</td>
                  <td className={styles.td}>{item.option}</td>
                  <td className={styles.td}>
                    <button
                      className={styles.qtyBtn}
                      disabled={item.quantity < 2}
                      onClick={(e) => {
                        decrementQty(e, item);
                      }}
                    >
                      -
                    </button>

                    <div className={styles.qtyText}>{item.quantity}</div>
                    <button
                      className={styles.qtyBtn}
                      onClick={(e) => incrementQty(e, item)}
                    >
                      +
                    </button>
                  </td>
                  <td className={styles.td}>${item.price * item.quantity}</td>
                  <td className={styles.td}>
                    <button
                      className={styles.removeBtn}
                      onClick={(e) => handleDelete(e, item)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.btnWrapper}>
            <h1 className={styles.total}>Total: ${cartTotal}</h1>
            <button className={styles.checkoutBtn} onClick={handleOrder}>
              Go to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
