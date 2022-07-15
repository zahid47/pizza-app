import useCartStore from "../zustand/cartStore";
import { useState, useEffect, MouseEvent, useCallback } from "react";
import axios from "../utils/axios";
import Cookies from "js-cookie";

export default function Cart() {
  const { cartContent, removeFromCart, clearCart } = useCartStore(
    (state) => state
  );
  const [cartContentState, setCartContentState] = useState<any>();

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
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    productId: string
  ) => {
    console.log("remove");
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
          variant: item.variant,
          quantity: item.quantity,
        };
      });

    const orderDetails = {
      products,
      payment: {
        method: "cash",
      },
    };

    const accessToken = Cookies.get("accessToken");
    await axios.post("/order", orderDetails, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    clearCart();
    alert("Order placed successfully");
  };

  return (
    <>
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
          <button onClick={handleOrder} className="btn btn-dark">
            Confirm Order
          </button>
        </>
      )}
    </>
  );
}
