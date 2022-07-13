import styles from "../styles/NavBar.module.css";

export default function NavBar() {
  return (
    <div className={styles.filters}>
      <ul className={styles.navlinks}>
        <li className={styles.navlink}>
          <input type="text" placeholder="search" />
        </li>
        <li className={styles.navlink}>
          <a href="/">All</a>
        </li>
        <li className={styles.navlink}>
          <a href="/">Vegan</a>
        </li>
        <li className={styles.navlink}>
          <a href="/">Non Vegan</a>
        </li>
      </ul>
    </div>
  );
}
