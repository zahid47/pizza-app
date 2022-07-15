import { GetServerSideProps } from "next";
import Container from "react-bootstrap/Container";
import EditProduct from "../../../../components/adminComponents/EditProduct";
import axios from "../../../../utils/axios";

export default function Edit({ product }: { product: any }) {
  return (
    <Container>
      <EditProduct _product={product} />
    </Container>
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
