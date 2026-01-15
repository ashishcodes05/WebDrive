import { Cloud, CheckCircle, Mail, Lock, User } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

const Register = () => {
  const BASE_URL = "http://localhost:4000";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendOtp = async () => {
    if (!formData.email) return toast.error("Please enter email");

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("OTP sent to your email");
        setOtpSent(true);
      } else toast.error(data.message);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error("Please enter OTP");

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, enteredOtp: otp.toString() }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Email verified");
        setEmailVerified(true);
        setOtpSent(false);
      } else toast.error(data.message);
    } catch {
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!emailVerified) return toast.error("Verify your email first");

    try {
      const res = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else toast.error(data.message);
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur px-10 py-10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-indigo-500">
            <Cloud size={42} />
            <h1 className="text-3xl font-semibold text-white">
              Welcome to Webdrive
            </h1>
          </div>
          <p className="text-zinc-400 mt-2">
            Secure your access to Webdrive
          </p>
        </div>

        {/* Name */}
        <div className="relative mb-4">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={onChangeHandler}
            required
            className="w-full h-12 pl-11 pr-4 rounded-full bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Email + OTP */}
        <div className="flex gap-3 mb-3">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={onChangeHandler}
              disabled={emailVerified}
              required
              className="w-full h-12 pl-11 pr-4 rounded-full bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            />
          </div>

          {!emailVerified ? (
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="h-12 px-6 rounded-full bg-indigo-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
            </button>
          ) : (
            <div className="flex items-center gap-1 px-4 text-green-500 font-medium">
              <CheckCircle size={18} /> Verified
            </div>
          )}
        </div>

        {otpSent && !emailVerified && (
          <div className="flex gap-3 mb-4 animate-fade-in">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="flex-1 h-12 px-5 rounded-full bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading}
              className="h-12 px-6 rounded-full bg-green-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
            >
              Verify
            </button>
          </div>
        )}

        {/* Password */}
        <div className="relative mb-6">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="password"
            name="password"
            placeholder="Create a Strong Password"
            value={formData.password}
            onChange={onChangeHandler}
            required
            className="w-full h-12 pl-11 pr-4 rounded-full bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-12 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition"
        >
          Create Account
        </button>

        <p className="text-zinc-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
