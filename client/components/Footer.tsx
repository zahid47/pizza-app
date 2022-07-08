import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>&copy; {new Date().getFullYear()} The Rolling Dough</div>
    </footer>
  );
}
