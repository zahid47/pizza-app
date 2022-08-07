import Menu from "../components/Menu";
import NavBar from "../components/NavBar";
import axios from "../utils/axios";

const Home = ({ data }: { data: any }) => {
  return (
    <>
      <p style={{ color: "red" }}>
        The frontend is a bit janky right now, I&apos;m going to revamp it soon!
      </p>
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
