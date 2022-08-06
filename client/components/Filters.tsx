import styles from "../styles/NavBar.module.css";
import Link from "next/link";

export default function Filters() {
  return (
    <div className={styles.filters}>
      <ul className={styles.navlinks}>
        <li className={styles.navlink}>
          <input type="text" placeholder="search" />
        </li>
        <li className={styles.navlink}>
          <Link href="/">All</Link>
        </li>
        <li className={styles.navlink}>
          <Link href="/">Vegan</Link>
        </li>
        <li className={styles.navlink}>
          <Link href="/">Non Vegan</Link>
        </li>
      </ul>
    </div>
  );
}
