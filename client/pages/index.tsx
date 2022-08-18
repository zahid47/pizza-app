import type { GetServerSideProps, NextPage } from "next";
import Items from "../components/Items";
import Search from "../components/Search";
import axios from "../utils/axios";
import { useEffect, useState } from "react";

const Home: NextPage = ({ data }: any) => {
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<any>(data);

  useEffect(() => {
    setProducts(data);
  }, [data]);

  return (
    <div>
      <Search search={search} setSearch={setSearch} setProducts={setProducts} />
      <Items data={products} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await axios.get(`/product`);
  const data = res.data;

  return {
    props: {
      data,
    },
  };
};

export default Home;
