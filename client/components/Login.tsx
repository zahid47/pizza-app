import axios from "../utils/axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [creds, setCreds] = useState({});
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/login", creds);
      Cookies.set("accessToken", response.data.accessToken);
      router.push("/");
    } catch {
      router.push("/login");
    }
  };

  return (
    <div>
      <form>
        <label>Email:&nbsp;</label>
        <input
          type="email"
          onChange={(e) => setCreds({ ...creds, email: e.target.value })}
        />

        <br />
        <br />

        <label>Password:&nbsp;</label>
        <input
          type="password"
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
        />

        <br />
        <br />

        <button onClick={async (e) => await handleLogin(e)}>Log In</button>
      </form>
    </div>
  );
}
