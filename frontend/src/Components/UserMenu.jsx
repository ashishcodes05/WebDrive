import { useEffect, useRef } from "react";
import { Shield, Laptop, Crown, Settings } from "lucide-react";
import { createPortal } from "react-dom";
import { useState } from "react";
import { Link } from "react-router";

const UserMenu = ({ user, onLogout, onLogoutAll, onUpgrade, onClose }) => {
  const [picture, setPicture] = useState(user?.picture || null);
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  useEffect(() => {
    if(user?.picture){
      setPicture(user.picture);
    }
  }, [user]);
  return createPortal(
    <div
      ref={menuRef}
      className="
        absolute right-32 top-16 mt-3 w-72
        bg-[#0f0f1a]/95 backdrop-blur-xl
        border border-white/10
        rounded-2xl
        shadow-2xl shadow-black/60
        overflow-hidden
        z-50
        animate-pop
      "
    >
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-accent to-secondary-accent flex items-center justify-center text-white font-semibold">
            {picture ? <img referrerPolicy="no-referrer" src={`${picture}`} alt={user?.name || "User"} className="w-10 h-10 rounded-full object-cover" /> : user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">
              {user?.name || "User"}
            </p>
            <p className="text-text-secondary text-xs truncate">
              {user?.email || "user@email.com"}
            </p>
          </div>
        </div>
      </div>

      <Link
        to="/settings"
        onClick={() => {
          onClose();
        }}
        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-400 hover:bg-primary/10 transition"
      >
        <Settings className="w-4 h-4" />
         Settings
      </Link>
      <button
        onClick={onUpgrade}
        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-primary-accent hover:bg-primary/10 transition"
      >
        <Crown className="w-4 h-4" />
        Upgrade to Pro
      </button>

      <div className="border-t border-white/5" />

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
      >
        <Laptop className="w-4 h-4" />
        Logout from this device
      </button>

      <button
        onClick={onLogoutAll}
        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
      >
        <Shield className="w-4 h-4" />
        Logout from all devices
      </button>
      
    </div>,
    document.getElementById("portal-root")
  );
};

export default UserMenu;