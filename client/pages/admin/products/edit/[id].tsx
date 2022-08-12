import axios from "../../../../utils/axios";
import { GetServerSideProps } from "next";

export default function Edit({ productId }: any) {
  return <div>{`Editing ${productId}`}</div>;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const productId = params?.id;

  //   const res = await axios.get(`/product/${productId}`);
  //   const product = res.data;

  return {
    props: {
      productId,
    },
  };
};
