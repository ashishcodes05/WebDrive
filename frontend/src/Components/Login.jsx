import { Cloud, Mail, Lock } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useAppContext } from "../Context/AppContext";

const Login = () => {
  const BASE_URL = "http://localhost:4000";
  const navigate = useNavigate();
  const { setLoadingUser, fetchUserData } = useAppContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.error("Invalid email or password");
        return;
      }

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
        setLoadingUser(false);
        navigate("/");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur px-10 py-10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-indigo-500">
            <Cloud size={42} />
            <h1 className="text-3xl font-semibold text-white">Login</h1>
          </div>
          <p className="text-zinc-400 mt-2">
            Welcome back, sign in to continue
          </p>
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={onChangeHandler}
            required
            className="w-full h-12 pl-11 pr-4 rounded-full bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Password */}
        <div className="relative mb-3">
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={onChangeHandler}
            required
            className="w-full h-12 pl-11 pr-4 rounded-full bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-zinc-400 text-sm mt-5 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
