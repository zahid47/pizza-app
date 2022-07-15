import { GetServerSideProps } from "next";
import axios from "../../utils/axios";
import Image from "next/image";
import { MouseEvent } from "react";
import useCartStore from "../../zustand/cartStore";

export default function SingleProduct({ product }: { product: any }) {
  const { addToCart } = useCartStore((state) => state);

  const handleAddToCart = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    const orderedProduct = {
      id: product._id,
      name: product.name,
      price: product.prices[0].price,
      quantity: 1,
    };
    addToCart(orderedProduct);
  };

  return (
    <>
      <h1>{product.name}</h1>
      <Image
        src={product.images[0]}
        alt={product.name}
        width={500}
        height={500}
      />
      <p>{product.description}</p>
      <p>${product.prices[0].price}</p>
      <button
        onClick={(e) => {
          handleAddToCart(e);
        }}
      >
        Add to Cart
      </button>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const productId = context.params!.id; // skipcq // we know params exists for sure no cap

  const res = await axios.get(`/product/${productId}`);
  const product = res.data;

  return {
    props: {
      product,
    },
  };
};
