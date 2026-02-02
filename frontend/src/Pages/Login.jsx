import { Cloud, Mail, Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAppContext } from "../Context/AppContext";
import { useGoogleLogin } from "@react-oauth/google";

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

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

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
        if (redirect) {
          window.location.href = `http://localhost:4000${redirect}`;
          return;
        }
        navigate("/");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    scope: "openid email profile",
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const response = await fetch(`${BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeResponse.code }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Logged in with Google successfully");
        await fetchUserData();
        setLoadingUser(false);
        if (redirect) {
          window.location.href = `http://localhost:4000${redirect}`;
          return;
        }
        navigate("/");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  const loginWithGitHub = () => {
    window.location.href = `${BASE_URL}/auth/github`;
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0f0f1a] px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-purple-600/25 blur-[120px]" />
        <div className="absolute bottom-[-200px] left-1/3 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[140px]" />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:24px_24px]" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl backdrop-saturate-150 px-10 py-10 transition-all duration-300 shadow-[0_0_60px_-15px_rgba(79,139,255,0.45)]"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-3 text-primary">
            <Cloud className="drop-shadow-[0_0_12px_rgba(79,139,255,0.8)] fill-current" size={46} />
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Welcome back to WebDrive
            </h1>
          </div>
          <p className="text-zinc-400 mt-2">
            Secure cloud access, just one step away
          </p>
        </div>

        <div className="relative mb-4">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={onChangeHandler}
            required
            className="w-full h-12 pl-11 pr-4 rounded-full bg-zinc-900/60 text-white outline-none border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition"
          />
        </div>

        <div className="relative mb-3">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={onChangeHandler}
            required
            className="w-full h-12 pl-11 pr-4 rounded-full bg-zinc-900/60 text-white outline-none border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition"
          />
        </div>

        <div className="text-right mb-6">
          <Link to="/forgot-password" className="text-sm text-indigo-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-zinc-400 text-sm mt-5 text-center">
          Don’t have an account?{" "}
          <Link to={`/register${redirect ? `?redirect=${redirect}` : ""}`} className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>

        <div className="flex items-center my-6 gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-sm text-zinc-400">OR</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <button
          type="button"
          onClick={() => loginWithGoogle()}
          className="w-full h-12 flex items-center justify-center gap-3 rounded-full bg-white text-gray-800 font-medium border border-gray-300 hover:bg-gray-50 transition shadow-sm hover:scale-[1.01] active:scale-[0.99]"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.3 0 6.3 1.1 8.6 3.2l6.4-6.4C34.8 2.6 29.7 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.7 6C12.5 13.2 17.8 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.7h12.7c-.6 3.1-2.4 5.7-5.1 7.4l7.9 6.1c4.6-4.2 7.3-10.4 7.3-17.1z" />
            <path fill="#FBBC05" d="M10.4 28.9c-.5-1.4-.8-2.9-.8-4.4s.3-3 .8-4.4l-7.7-6c-1.6 3.2-2.6 6.8-2.6 10.4s.9 7.2 2.6 10.4l7.7-6z" />
            <path fill="#34A853" d="M24 48c5.7 0 10.8-1.9 14.4-5.1l-7.9-6.1c-2.2 1.5-5 2.4-8.5 2.4-6.2 0-11.5-3.7-13.7-8.8l-7.7 6C6.6 42.6 14.6 48 24 48z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={loginWithGitHub}
          className="mt-3 w-full h-14 flex items-center justify-center gap-3 rounded-full bg-[#0d1117] text-white font-medium border border-white/10 hover:bg-[#161b22] transition shadow-sm hover:scale-[1.01] active:scale-[0.99]"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M12 0C5.37 0 0 5.47 0 12.2c0 5.38 3.44 9.94 8.2 11.55.6.11.82-.26.82-.58v-2.04c-3.34.74-4.04-1.64-4.04-1.64-.55-1.42-1.35-1.8-1.35-1.8-1.1-.76.08-.74.08-.74 1.22.09 1.86 1.27 1.86 1.27 1.08 1.89 2.83 1.34 3.52 1.02.11-.8.42-1.34.76-1.65-2.66-.31-5.47-1.36-5.47-6.05 0-1.34.47-2.44 1.24-3.3-.12-.31-.54-1.56.12-3.25 0 0 1.01-.33 3.3 1.26.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.29-1.59 3.3-1.26 3.3-1.26.66 1.69.24 2.94.12 3.25.77.86 1.24 1.96 1.24 3.3 0 4.7-2.81 5.73-5.49 6.04.43.38.82 1.12.82 2.26v3.35c0 .32.22.7.83.58C20.56 22.14 24 17.58 24 12.2 24 5.47 18.63 0 12 0z" />
          </svg>
          <span>Continue with GitHub</span>
        </button>
      </form>
    </div>
  );
};

export default Login;