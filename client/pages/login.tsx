import axios from "../utils/axios";
import Cookies from "js-cookie";
import { useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";
import Link from "next/link";

export default function Login() {
  const [creds, setCreds] = useState({});
  const [loggingIn, setLoggingIn] = useState(false);
  // const [errors, setErrors] = useState<any>([]);
  const router = useRouter();

  const handleLogin = async (
    _e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    setLoggingIn(true);
    try {
      const response = await axios.post("/auth/login", creds);
      Cookies.set("accessToken", response.data.accessToken);
      await router.push("/");
      router.reload(); //FIXME: idk if this is the right way to do this
    } catch (err: any) {
      console.log(err.response.data.message);
      // setErrors(err.response.data.message);
    }
    setLoggingIn(false);
  };

  return (
    <div className={styles.container}>
      <div>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          onChange={(e) => setCreds({ ...creds, email: e.target.value })}
        />
        {/* <p className={styles.error}>
          {errors.filter((err: any) => err.path.includes("email"))[0]?.message}
        </p> */}

        <label className={styles.label}>Password</label>
        <input
          className={styles.input}
          type="password"
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
        />
        {/* <p className={styles.error}>
          {
            errors.filter((err: any) => err.path.includes("password"))[0]
              ?.message
          }
        </p> */}
        {/* <p>
          <Link href={"/forgot-pass"} passHref>
            <a className={styles.forgotpass}>Forgot Password?</a>
          </Link>
        </p> */}

        <button
          className={styles.loginbtn}
          onClick={async (e) => await handleLogin(e)}
          disabled={loggingIn}
        >
          {loggingIn ? "Logging in..." : "Log In"}
        </button>
        <p>
          Don&apos;t have an account?{" "}
          <Link href={"/register"} passHref>
            <a className={styles.createlink}>Create One!</a>
          </Link>
        </p>
        <p className={styles.infotext}>FOR TESTING</p>
        <p className={styles.infotext}>email: admin@test.com</p>
        <p className={styles.infotext}>password: admin</p>
        <p className={styles.infotext}>
          (go to &apos;/admin&apos; after logging in, pls let me know if you
          break anyting lol)
        </p>
      </div>
    </div>
  );
}
