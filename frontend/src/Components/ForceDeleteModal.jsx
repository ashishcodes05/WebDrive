import { Trash2, AlertTriangle, X } from "lucide-react";
import { createPortal } from "react-dom";

const ForceDeleteModal = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  userName = "this user",
}) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[var(--color-card-bg)] border border-white/10 shadow-2xl">
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/15 flex items-center justify-center">
              <AlertTriangle className="text-red-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Delete user permanently
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                This action cannot be undone
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

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-zinc-300 leading-relaxed">
            You are about to permanently delete{" "}
            <span className="text-white font-medium">{userName}</span>.
          </p>

          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
            <ul className="text-sm text-red-300 space-y-1">
              <li>• All files and folders will be removed</li>
              <li>• Active sessions will be terminated</li>
              <li>• This data cannot be recovered</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-5 border-t border-white/10">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm text-zinc-300 border border-white/10 hover:bg-white/5 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
              loading
                ? "border-red-500/30 text-red-300 cursor-not-allowed"
                : "border-red-500/40 text-red-400 hover:bg-red-500/10"
            }`}
          >
            <Trash2 size={15} />
            Delete user
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default ForceDeleteModal;
