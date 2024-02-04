"use client";
import React, { useState } from "react";
import { login } from "../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleLogin = async () => {
    try {
      if (!username || !password) {
        alert("Username and password are required.");
        return;
      }
      setLoading(true);

      const resp = await login({ username, password });
      if (resp?.user && typeof window !== "undefined") {
        const { access_token, username, _id } = resp?.user;
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("username", username);
        localStorage.setItem("_id", _id);
        localStorage.setItem("auth", "yes");

        if (access_token) {
          router.push("/");
        }
      } else {
        alert(`Error while login: ${resp}`);
      }
    } catch (error) {
      console.error("Error while login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Username:
        </label>
        <input
          className="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Password:
        </label>
        <input
          className="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => handleLogin()}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;
