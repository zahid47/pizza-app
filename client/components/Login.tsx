import axios from "../utils/axios";
import Cookies from "js-cookie";
import { useState } from "react";
import Router from "next/router";

export default function Login() {
  const [creds, setCreds] = useState({});

  const handleLogin = (e: any) => {
    e.preventDefault();

    axios
      .post("/auth/login", creds)
      .then((response: any) => {
        Cookies.set("accessToken", response.data.accessToken, {
          expires: 1,
        });

        const data = response.data;

        if (data.role === "admin") {
          Router.push("/admin");
          return;
        }
        Router.push("/");
      })
      .catch((err: any) => {
        Router.push("/login");
      });
  };

  return (
    <div>
      <form>
        <label>Email: </label>
        <input
          type="email"
          onChange={(e) => setCreds({ ...creds, email: e.target.value })}
        />

        <label>Password: </label>
        <input
          type="password"
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
        />

        <button onClick={handleLogin}>Log In</button>
      </form>
    </div>
  );
}
