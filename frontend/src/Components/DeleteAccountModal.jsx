import { AlertTriangle, Trash2, ShieldAlert, X } from "lucide-react";
import { createPortal } from "react-dom";

const DeleteAccountModal = ({ deletingAccount, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-card-bg/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15">
              <AlertTriangle className="text-red-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Delete account
              </h2>
              <p className="text-xs text-text-secondary">
                This action cannot be undone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-text-secondary hover:bg-white/10 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-4 text-sm text-text-secondary">
          <p className="text-white">
            Are you sure you want to permanently delete your account?
          </p>

          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-red-400">
              <ShieldAlert size={16} />
              <span className="font-medium">What will be deleted</span>
            </div>

            <ul className="list-disc pl-5 space-y-1 text-red-300/90">
              <li>All files and folders</li>
              <li>Starred and recent items</li>
              <li>Shared and uploaded content</li>
              <li>Account preferences and settings</li>
            </ul>
          </div>

          <p className="text-xs">
            Once deleted, your data cannot be recovered. This includes all
            files, folders, and account history.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition shadow-lg shadow-red-600/30"
          >
            <Trash2 size={16} />
            {deletingAccount ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default DeleteAccountModal;