import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function SharedUsersDropdown({
  file,
  currentUser,
  onRoleChange
}) {
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  if (!file) return null;

  const ownerId = file.userId._id.toString()
  const currentId = currentUser?.id?.toString?.();
  const isOwner = ownerId && currentId ? ownerId === currentId : false;

  const ownerUser = file.userId;

  const ownerEntry = {
    userId: ownerUser,
    role: "owner",
    isOwner: true
  }

  const users = [ownerEntry, ...file.sharedWith];

  if (users.length === 0) return null;

  const openDropdown = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 8,
      left: rect.right - 320
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const close = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={openDropdown}
        className="
          flex items-center gap-2
          px-3 py-1.5 rounded-lg
          bg-white/5 border border-white/10
          text-xs text-zinc-300
          hover:bg-white/10 transition
        "
      >
        Shared with {users.length}
        <ChevronDown size={14} />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: 320
            }}
            className="
              z-9999
              rounded-xl border border-white/10
              bg-card-bg/95 backdrop-blur-xl
              shadow-xl shadow-black/50
            "
          >
            <div className="py-2 max-h-72 overflow-y-auto scrollbar-none">
              {users.map((entry) => (
                <div
                  key={entry.userId._id}
                  className="
                    flex items-center justify-between gap-3
                    px-3 py-2 hover:bg-white/5 transition
                  "
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      referrerPolicy="no-referrer"
                      src={entry.userId.picture || "/avatar.png"}
                      alt={entry.userId.email}
                      className="w-9 h-9 rounded-full object-cover"
                    />

                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">
                        {entry.userId.email}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {entry.role === "owner" ? "Owner" : "Shared user"}
                      </p>
                    </div>
                  </div>

                  {entry.role === "owner" ? (
                    <span
                      className="
                        text-xs px-2 py-1 rounded-full
                        bg-primary/20 text-primary
                      "
                    >
                      Owner
                    </span>
                  ) : (
                    <select
                      disabled={!isOwner}
                      value={entry.role}
                      onChange={(e) =>
                        onRoleChange(entry.userId._id, e.target.value)
                      }
                      className="
                        bg-black/30 border border-white/10
                        text-xs text-white rounded-md
                        px-2 py-1 outline-none
                        hover:bg-black/50
                        disabled:opacity-40 disabled:cursor-not-allowed
                      "
                    >
                      <option value="viewer">View</option>
                      <option value="editor">Edit</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>,
          document.getElementById("portal-root")
        )}
    </>
  );
}
