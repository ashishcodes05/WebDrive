import { useGoogleLogin } from "@react-oauth/google";
import { Cloud, CheckCircle, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useAppContext } from "../Context/AppContext";

const Register = () => {
  const BASE_URL = "http://localhost:4000";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { fetchUserData, setLoadingUser } = useAppContext();

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

  const loginWithGoogle = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async codeResponse => {
      const response = await fetch(`${BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeResponse.code }),
        credentials: "include",
      })
      const data = await response.json();
      if (data.success) {
        toast.success("Logged in with Google successfully");
        await fetchUserData();
        setLoadingUser(false);
        navigate("/");
      }
    },
    onError: () => {
      console.log("Google login failed");
      toast.error("Google login failed");
    },
    flow: 'auth-code',
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur px-10 py-10 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.35)] hover:shadow-[0_0_70px_-15px_rgba(99,102,241,0.55)]"
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
        <div className="flex items-center my-6 gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-sm text-text-secondary">OR</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>
        <button
          type="button"
          onClick={() => loginWithGoogle()}
          className="
            w-full h-12
            flex items-center justify-center gap-3
            rounded-full
            bg-white text-gray-800
            font-medium
            border border-gray-300
            hover:bg-gray-50
            active:bg-gray-100
            transition
            shadow-sm
          "
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.3 0 6.3 1.1 8.6 3.2l6.4-6.4C34.8 2.6 29.7 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.7 6C12.5 13.2 17.8 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.7h12.7c-.6 3.1-2.4 5.7-5.1 7.4l7.9 6.1c4.6-4.2 7.3-10.4 7.3-17.1z" />
            <path fill="#FBBC05" d="M10.4 28.9c-.5-1.4-.8-2.9-.8-4.4s.3-3 .8-4.4l-7.7-6c-1.6 3.2-2.6 6.8-2.6 10.4s.9 7.2 2.6 10.4l7.7-6z" />
            <path fill="#34A853" d="M24 48c5.7 0 10.8-1.9 14.4-5.1l-7.9-6.1c-2.2 1.5-5 2.4-8.5 2.4-6.2 0-11.5-3.7-13.7-8.8l-7.7 6C6.6 42.6 14.6 48 24 48z" />
          </svg>

          <span>Continue with Google</span>
        </button>
      </form>
    </div>
  );
};

export default Register;
