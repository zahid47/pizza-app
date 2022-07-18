//TODO: move total to zustand, move calculateTotal to its own file

import React, { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/checkoutForm";
import useCartStore from "../zustand/cartStore";
import axios from "../utils/axios";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const { cartContent } = useCartStore((state) => state);

  const calculateTotal = useCallback(() => {
    let total = 0;
    cartContent &&
      cartContent.forEach((item: any) => {
        total += item.price * item.quantity;
      });
    return total;
  }, [cartContent]);

  useEffect(() => {
    const total = calculateTotal();

    const products =
      cartContent &&
      cartContent.map((item: any) => {
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

    // Create PaymentIntent as soon as the page loads
    const getClientSecret = async () => {
      const res = await axios.post(
        "/order/create-payment-intent",
        orderDetails,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;
      setClientSecret(data.clientSecret);
    };

    getClientSecret();
  }, [calculateTotal, cartContent]);

  const appearance: {
    theme: "stripe" | "night" | "flat" | "none";
  } = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      <h1>Checkout</h1>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
