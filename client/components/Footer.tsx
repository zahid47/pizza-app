import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      Copyright &copy; Cheesarella {new Date().getFullYear()}. All rights
      reserved.
    </div>
  );
}
