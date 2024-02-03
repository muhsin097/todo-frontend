"use client";
import React, { useState } from "react";
import { login } from "../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const resp = await login({ username, password });
      if (resp?.user && typeof window !== "undefined") {
        const { access_token, username, _id } = resp?.user;
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("username", username);
        localStorage.setItem("_id", _id);
        if (access_token) {
          router.push("/");
        }
      } else {
        alert(resp);
      }
    } catch (error) {
      console.error("Error while login:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={() => handleLogin()}>Login</button>
    </div>
  );
};

export default Login;
