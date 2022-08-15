import axios from "../utils/axios";
import { useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Register.module.css";
import Link from "next/link";

export default function Register() {
  const [creds, setCreds] = useState({});
  // const [errors, setErrors] = useState({ email: "", password: "" });
  const [registering, setRegistering] = useState(false);
  const router = useRouter();

  const handleRegister = async (
    _e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    setRegistering(true);
    try {
      await axios.post("/user", creds);
      alert("Registered successfully");
      router.push("/login");
    } catch (err: any) {
      console.log(err.response.data);
    }
    setRegistering(false);
  };

  return (
    <div className={styles.container}>
      <div>
        <label className={styles.label}>Name</label>
        <input
          className={styles.input}
          type="text"
          onChange={(e) => setCreds({ ...creds, name: e.target.value })}
        />

        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          onChange={(e) => setCreds({ ...creds, email: e.target.value })}
        />
        {/* <p className={styles.error}>{errors.email}</p> */}

        <label className={styles.label}>Password</label>
        <input
          className={styles.input}
          type="password"
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
        />
        {/* <p className={styles.error}>{errors.password}</p> */}

        <label className={styles.label}>Phone</label>
        <input
          className={styles.input}
          type="number"
          onChange={(e) => setCreds({ ...creds, phone: e.target.value })}
        />

        <label className={styles.label}>Address</label>
        <input
          className={styles.input}
          type="text"
          onChange={(e) =>
            setCreds({ ...creds, address: { addressLine: e.target.value } })
          }
        />

        <button
          disabled={registering}
          className={styles.registerbtn}
          onClick={async (e) => await handleRegister(e)}
        >
          {registering ? "Registering..." : "Register"}
        </button>
        <p>
          Already have an account?{" "}
          <Link href={"/login"} passHref>
            <a className={styles.createlink}>Log In</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
