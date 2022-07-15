import { GetServerSideProps } from "next";
import axios from "../../utils/axios";
import Orders from "../../components/adminComponents/Orders";
import Products from "../../components/adminComponents/Products";
import CreateNewProduct from "../../components/adminComponents/CreateNewProduct";
import Container from "react-bootstrap/Container";
import { useUserStore } from "../../zustand/userStore";

export default function Admin({
  orders,
  products,
}: {
  orders: any;
  products: any;
}) {
  const user = useUserStore((state) => state.user);

  return (
    <Container>
      <h1>Welcome {user.name}</h1>
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
