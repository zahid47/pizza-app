import axios from "../utils/axios";
import { useState } from "react";
import Router from "next/router";

export default function Register() {
  const [creds, setCreds] = useState({});

  const handleRegister = (e: any) => {
    e.preventDefault();

    axios
      .post("/user", creds)
      .then(() => {
        Router.push("/login");
      })
      .catch((err: any) => {
        Router.push("/register");
      });
  };

  return (
    <div>
      <form>
        <label>Name: </label>
        <input
          type="text"
          onChange={(e) => setCreds({ ...creds, name: e.target.value })}
        />

        <label>Email: </label>
        <input
          type="email"
          onChange={(e) => setCreds({ ...creds, email: e.target.value })}
        />

        <label>Phone: </label>
        <input
          type="number"
          onChange={(e) => setCreds({ ...creds, phone: e.target.value })}
        />

        <label>Address: </label>
        <input
          type="address"
          onChange={(e) =>
            setCreds({ ...creds, address: { addressLine: e.target.value } })
          }
        />

        <label>Password: </label>
        <input
          type="password"
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
        />

        <button onClick={handleRegister}>Create Account</button>
      </form>
    </div>
  );
}
