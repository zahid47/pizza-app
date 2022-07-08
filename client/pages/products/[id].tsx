import { GetServerSideProps } from "next";
import axios from "../../utils/axios";
import Image from "next/image";

export default function SingleProduct({ product }: { product: any }) {
  return (
    <>
      <h1>{product.name}</h1>
      {/* <Image src={product.image} alt={product.name} /> */}
      <p>{product.description}</p>
      <p>${product.prices[0].price}</p>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const productId = context.params!.id; // we know params exists for sure no cap

  const res = await axios.get(`/product/${productId}`);
  const product = res.data;

  return {
    props: {
      product,
    },
  };
};
