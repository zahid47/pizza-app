import type { GetServerSideProps, NextPage } from "next";
import Items from "../components/Items";
import axios from "../utils/axios";

const Home: NextPage = ({ data }: any) => {
  return (
    <div>
      <Items data={data} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await axios.get("/product");
  const data = res.data;

  return {
    props: {
      data,
    },
  };
};

export default Home;
