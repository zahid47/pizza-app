import Menu from "../components/Menu";
import NavBar from "../components/NavBar";
import axios from "../utils/axios";

const Home = ({ data }: { data: any }) => {
  return (
    <>
      <NavBar />
      <Menu data={data} />
    </>
  );
};

export const getServerSideProps = async () => {
  const res = await axios.get("/product");
  const data = res.data;

  return {
    props: {
      data,
    },
  };
};

export default Home;
