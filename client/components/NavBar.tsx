import { useUserStore } from "../zustand/userStore";
import styles from "../styles/NavBar.module.css";

export default function NavBar() {

  const user = useUserStore((state) => state.user);

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
              <a href="#">Logout</a>
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
