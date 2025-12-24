import { LogOut } from "lucide-react";
import { createPortal } from "react-dom";

const UserMenu = ({ user, onLogout }) => {
  return createPortal(
    <div
      className="
        absolute right-4 top-16 mt-3 w-64
        bg-[#0f1629]/95 backdrop-blur-sm
        border border-white/10
        rounded-xl
        shadow-xl shadow-black/50
        animate-pop
        overflow-hidden
        z-50
      "
    >
      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-white font-medium truncate">
          {user?.name || "User"}
        </p>
        <p className="text-gray-400 text-sm truncate">
          {user?.email || "user@email.com"}
        </p>
      </div>

      <button
        onClick={onLogout}
        className="
          w-full flex items-center gap-3
          px-5 py-3
          text-sm text-red-400
          hover:bg-red-500/10
          transition
        "
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>,
    document.getElementById("portal-root")
  );
};

export default UserMenu;
