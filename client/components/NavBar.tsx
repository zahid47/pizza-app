import { useUserStore } from "../zustand/userStore";
import styles from "../styles/NavBar.module.css";
import useCartStore from "../zustand/cartStore";
import axios from "../utils/axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function NavBar() {
  const { user, setUser } = useUserStore((state) => state);
  const cartContent = useCartStore((state) => state.cartContent);
  const router = useRouter();

  const cartTotalQty = cartContent.reduce((totalQty, product) => {
    //@ts-ignore
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
          <Link href="/">THE ROLLING DOUGH</Link>
        </li>
        <li className={styles.navlink}>
          <Link href="#">Menu</Link>
        </li>
        <li className={styles.navlink}>
          <Link href="#">Outlets</Link>
        </li>
        {user.name ? (
          <>
            <li className={styles.navlinkRight}>
              <button className="btn" onClick={logOut}>
                Logout
              </button>
            </li>
            <li className={styles.navlinkRight}>
              <Link href="/cart">Cart ({cartTotalQty})</Link>
            </li>
            <li className={styles.navlinkRight}>
              <Link href="/orders">My Orders</Link>
            </li>
            <li className={styles.navlinkRight}>
              <Link href="#">Hello, {user.name}</Link>
            </li>
          </>
        ) : (
          <>
            <li className={styles.navlinkRight}>
              <Link href="/login">Login</Link>
            </li>
            <li className={styles.navlinkRight}>
              <Link href="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
