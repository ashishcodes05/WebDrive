import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function ProfileSettingsModal({ isOpen, onClose, user }) {
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-card-bg shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <label className="text-sm text-text-secondary">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-background px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">
              Email
            </label>
            <input
              value={user?.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-background px-4 py-3 text-sm text-gray-400 ring-1 ring-white/5"
            />
            <p className="text-xs text-gray-500">
              Email cannot be changed once created
            </p>
          </div>
            <p className="text-sm text-text-secondary">Set a password to enable manual login in addition to your social login.</p>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm text-text-secondary">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-background px-4 py-3 pr-11 text-sm text-white outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text-secondary">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl bg-background px-4 py-3 pr-11 text-sm text-white outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-primary-accent"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
}