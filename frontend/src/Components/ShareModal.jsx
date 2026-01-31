import { X, Link2, Copy, Check, Shield, Eye, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ShareModal = ({
  fileId,
  open,
  onClose,
  access = "view",
}) => {
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState(null);

  const shareLink = token ? `http://localhost:4000/share/file/${token}` : "Generating link...";
  if (!open) return null;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateToken = async () => {
    try {
      const response = await fetch("http://localhost:4000/share/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId }),
      });
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error("Error generating token:", error);
    }
  };

  useEffect(() => {
    generateToken();
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[var(--color-card-bg)] border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center">
              <Link2 size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Share link
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Anyone with the link can access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Link2 size={14} className="text-zinc-400" />
              <span className="text-sm text-zinc-300 truncate">
                {shareLink}
              </span>
            </div>

            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white hover:bg-white/5 transition"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-zinc-400" />
              <div>
                <p className="text-sm text-white">Link access</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Permissions for shared users
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                access === "edit"
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30"
                  : "bg-zinc-500/10 text-zinc-300 border-zinc-500/30"
              }`}
            >
              {access === "edit" ? (
                <Pencil size={12} />
              ) : (
                <Eye size={12} />
              )}
              {access === "edit" ? "Can edit" : "Can view"}
            </span>
          </div>

          <div className="rounded-xl bg-yellow-500/10 border border-yellow-400/20 px-4 py-3">
            <p className="text-xs text-yellow-300 leading-relaxed">
              Anyone with this link can access the item based on the permission above.
              Be careful when sharing sensitive files.
            </p>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-zinc-300 border border-white/10 hover:bg-white/5 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  , document.querySelector("#portal-root"))
};

export default ShareModal;
