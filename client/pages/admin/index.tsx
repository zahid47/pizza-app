import { GetServerSideProps } from "next";
import axios from "../../utils/axios";
import Orders from "../../components/Admin/Orders";
import Products from "../../components/Admin/Products";
import styles from "../../styles/Admin.module.css";

export default function Admin({ orders, products }: any) {
  return (
    <div className={styles.container}>
      <Orders orders={orders} />
      <Products products={products} />
    </div>
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
