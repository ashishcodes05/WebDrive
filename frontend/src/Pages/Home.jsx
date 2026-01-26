import { Cloud, Crown, User } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAppContext } from "../Context/AppContext";
import UserMenu from "../Components/UserMenu";
import assets from "../assets/assets";

const Home = () => {
  const [toggleUserMenu, setToggleUserMenu] = useState(false);
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/logout", {
        method: "POST",
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        navigate("/");
        setUser(null);
        toast.success(data.message);
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }

  const onLogoutAll = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/logoutAll", {
        method: "POST",
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        navigate("/");
        setUser(null);
        toast.success(data.message);
      }
    } catch (err) {
      toast.error("Error logging out from all devices:");
      console.error("Error logging out from all devices:", err);
    }
  }
  return (
    <section className="flex flex-col items-center text-white text-sm bg-background min-h-screen">
      <svg
        className="absolute z-10 w-screen -mt-40 md:mt-0"
        width="1440"
        height="676"
        viewBox="0 0 1440 676"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="-92"
          y="-948"
          width="1624"
          height="1624"
          rx="812"
          fill="url(#a)"
        />
        <defs>
          <radialGradient
            id="a"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(90 428 292)scale(812)"
          >
            <stop offset=".63" stop-color="#372AAC" stop-opacity="0" />
            <stop offset="1" stop-color="#372AAC" />
          </radialGradient>
        </defs>
      </svg>
      <nav className="z-50 flex items-center justify-between h-24 w-full py-6 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur">
        <div className="flex items-center flex-1/4">
          <Cloud className="text-primary-accent fill-current" size={40} />
          <span className="text-2xl text-primary font-bold ml-2">
            <i>Web</i>
            <span className="text-secondary-accent">
              <i>Drive</i>
            </span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 transition duration-500 text-lg text-white flex-2/4 justify-center">
          <NavLink to="/" end className={({ isActive }) => `hover:text-slate-300 transition ${isActive ? 'text-secondary-accent font-semibold border-b-2 border-primary-accent' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/directory" className={({ isActive }) => `hover:text-slate-300 transition ${isActive ? 'text-secondary-accent font-semibold border-b-2 border-primary-accent' : ''}`}>
            Files
          </NavLink>
          <NavLink to="/pricing" className={({ isActive }) => `hover:text-slate-300 transition ${isActive ? 'text-secondary-accent font-semibold border-b-2 border-primary-accent' : ''}`}>
            Pricing
          </NavLink>
          <NavLink to="/resources" className={({ isActive }) => `hover:text-slate-300 transition ${isActive ? 'text-secondary-accent font-semibold border-b-2 border-primary-accent' : ''}`}>
            Resources
          </NavLink>
        </div>

        {!user ? (<div className="hidden md:flex items-center justify-end space-x-3 text-md flex-1/4">
          <Link to="/register" className="px-6 py-2 bg-primary-accent hover:bg-primary-accent/80 transition text-white rounded-md">
            Register
          </Link>
          <Link to="/login" className="transition px-6 py-2 border border-secondary-400 font-bold rounded-md text-secondary-accent hover:border-slate-400 hover:text-slate-300">
            Login
          </Link>
        </div>) : (
          <div className="hidden md:flex items-center justify-end space-x-3 text-md flex-1/4">
            <button onClick={() => setToggleUserMenu(!toggleUserMenu)} className='flex flex-col items-center hover:text-primary-accent hover:scale-105 transition-transform duration-200 cursor-pointer'>
              <User className='text-secondary-accent fill-current' size={25} />
              <span className='text-sm text-primary-accent font-bold'>Profile</span>
              {toggleUserMenu && <UserMenu user={user} onLogout={onLogout} onLogoutAll={onLogoutAll} onClose={() => setToggleUserMenu(false)} onUpgrade={() => {
                navigate("/pricing")
              }} />}
            </button>
          </div>
        )}
        <button id="open-menu" className="md:hidden active:scale-90 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-menu-icon lucide-menu"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </button>
      </nav>
      <div
        id="mobile-navLinks"
        className="fixed inset-0 z-100 bg-black/60 backdrop-blur flex flex-col items-center justify-center text-xl gap-8 md:hidden transition-transform duration-300 -translate-x-full"
      >
        <a href="#products">Products</a>
        <a href="#resources">Resources</a>
        <a href="#stories">Stories</a>
        <a href="#pricing">Pricing</a>
        <button
          id="close-menu"
          class="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x-icon lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <div className="flex items-center space-x-2.5 border border-violet-500/30 rounded-full bg-violet-500/20 p-1 text-sm text-violet-600 mt-12">
        <div className="flex items-center space-x-1 bg-violet-500 text-white border border-violet-500 rounded-3xl px-3 py-1">
          <p>Exclusive Offer</p>
        </div>
        <p className="pr-3">Flat 50% off on Premium Plan!</p>
      </div>
      <div className="flex flex-col items-center justify-end z-40">
        <h1 className="text-center text-5xl leading-[68px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-2xl">
          <span className="text-primary-accent">Fast.</span> <span className="text-secondary-accent">Secure.</span> <span className="text-secondary">Simplified.</span> Cloud Storage.
        </h1>
        <p className="text-center text-base max-w-lg mt-2">
          A smarter way to store and access your files—anytime, anywhere. Your files stay private, encrypted, and always under your control.
        </p>
        <div className="flex items-center gap-4 mt-8">
          <button className="flex items-center gap-2 bg-primary-accent hover:bg-primary-accent/80 text-white active:scale-95 rounded-lg px-7 h-11">
            Get Free Access
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.166 10h11.667m0 0L9.999 4.165m5.834 5.833-5.834 5.834"
                stroke="#fff"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button className="flex items-center gap-2 border border-secondary-400 font-bold text-secondary-accent hover:border-slate-400 hover:text-slate-300 active:scale-95 transition rounded-lg px-8 h-11">
            Go Premium
            <Crown className="text-yellow-500" size={16} />
          </button>
        </div>
        <div className="p-2 border border-secondary-accent mt-12 rounded-2xl bg-card-bg/80 backdrop-blur-xl shadow-xl shadow-black/40 overflow-hidden">
          <img
            src={assets.directoryView}
            className="w-full rounded-[15px] max-w-2xl"
            alt="hero section showcase"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
