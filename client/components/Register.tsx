import axios from "../utils/axios";
import { useState } from "react";
import Router from "next/router";

export default function Register() {
  const [creds, setCreds] = useState({});

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post("/user", creds);
      Router.push("/login");
    } catch {
      Router.push("/register");
    }
  };

  return (
    <div>
      <form>
        <label>Name:&nbsp;</label>
        <input
          type="text"
          onChange={(e) => setCreds({ ...creds, name: e.target.value })}
        />

        <br />
        <br />

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

        <label>Phone:&nbsp;</label>
        <input
          type="number"
          onChange={(e) => setCreds({ ...creds, phone: e.target.value })}
        />

        <br />
        <br />

        <label>Address:&nbsp;</label>
        <input
          type="address"
          onChange={(e) =>
            setCreds({ ...creds, address: { addressLine: e.target.value } })
          }
        />

        <br />
        <br />

        <button onClick={async (e) => await handleRegister(e)}>
          Create Account
        </button>
      </form>
    </div>
  );
}
