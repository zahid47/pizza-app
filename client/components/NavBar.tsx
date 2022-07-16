import { useUserStore } from "../zustand/userStore";
import styles from "../styles/NavBar.module.css";
import useCartStore from "../zustand/cartStore";
import axios from "../utils/axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function NavBar() {
  const { user, setUser } = useUserStore((state) => state);
  const cartContent = useCartStore((state) => state.cartContent);
  const router = useRouter();

  const cartTotalQty = cartContent.reduce((totalQty, product) => {
    return totalQty + product.quantity;
  }, 0);

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

    // skipcq
    if (accessToken) getMe(accessToken);
  }, [setUser]);

  const logOut = () => {
    Cookies.remove("accessToken");
    setUser({});
    router.push("/");
  };

  return (
    <div>
      <ul className={styles.navlinks}>
        <li className={styles.navlink}>
          <a href="/">THE ROLLING DOUGH</a>
        </li>
        <li className={styles.navlink}>
          <a href="#">Menu</a>
        </li>
        <li className={styles.navlink}>
          <a href="#">Outlets</a>
        </li>
        {user.name ? (
          <>
            <li className={styles.navlinkRight}>
              <button className="btn" onClick={logOut}>Logout</button>
            </li>
            <li className={styles.navlinkRight}>
              <a href="/cart">Cart ({cartTotalQty})</a>
            </li>
            <li className={styles.navlinkRight}>
              <a href="/orders">My Orders</a>
            </li>
            <li className={styles.navlinkRight}>
              <a href="#">Logged in as: {user.name}</a>
            </li>
          </>
        ) : (
          <>
            <li className={styles.navlinkRight}>
              <a href="/login">Login</a>
            </li>
            <li className={styles.navlinkRight}>
              <a href="/register">Register</a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
