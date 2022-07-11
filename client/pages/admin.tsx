import { GetServerSideProps } from "next";
import axios from "../utils/axios";
import Orders from "../components/adminComponents/Orders";
import Products from "../components/adminComponents/Products";
import CreateNewProduct from "../components/adminComponents/CreateNewProduct";
import Container from "react-bootstrap/Container";

export default function Admin({
  orders,
  products,
}: {
  orders: any;
  products: any;
}) {
  return (
    <Container>
      {/* TODO: actually show the admin name here, idk why zustand store user is undefined in this page */}
      <h1>Welcome Admin</h1>
      <Orders orders={orders} />
      <Products products={products} />
      <CreateNewProduct />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessToken = context.req.cookies.accessToken;

  const ordersResponse = await axios.get("/order", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const productsResponse = await axios.get("/product", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const orders = ordersResponse.data;
  const products = productsResponse.data;

  return {
    props: {
      orders,
      products,
    },
  };
};
