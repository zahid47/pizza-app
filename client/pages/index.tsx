import Menu from "../components/Menu";
import NavBar from "../components/NavBar";
import axios from "../utils/axios";
import Cookies from "js-cookie";
import { useUserStore } from "../zustand/userStore";
import { useEffect } from "react";
import Filters from "../components/Filters";

const Home = ({ data }: { data: any }) => {
  const { setUser } = useUserStore((state) => state);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    const getMe = async (accessToken: string) => {
      try {
        const response = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = {
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          verified: response.data.verified,
          role: response.data.role,
        };

        setUser(user);
      } catch {
        Cookies.remove("accessToken");
      }
    };

    if (accessToken) getMe(accessToken);
  }, [setUser]);

  return (
    <>
      <NavBar />
      {/* <Filters /> */}
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
