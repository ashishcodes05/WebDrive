import { useEffect, useState } from "react";
import { Users, CircleDot, Trash2, LogOut, Shield } from "lucide-react";

const UsersPage = () => {
  const BASE_URL = "http://localhost:4000";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/user/getAllUsers`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setUsers(data.users);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const deleteUser = async (id) => {
    const ok = window.confirm(
      "Delete this user permanently? All files will be removed."
    );
    if (!ok) return;

    try {
      setDeletingId(id);
      const res = await fetch(`${BASE_URL}/user/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const online = users.filter((u) => u.isLoggedIn).length;
  const offline = users.length - online;

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-10 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center">
              <Users className="text-[var(--color-primary)]" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Users</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Manage roles and access across Webdrive
              </p>
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-400/20">
              <CircleDot size={12} />
              {online} Online
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
              <CircleDot size={12} />
              {offline} Offline
            </span>
          </div>
        </div>

        <div className="bg-[var(--color-card-bg)] rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-8 py-4 text-xs uppercase tracking-wider text-[var(--color-text-secondary)] bg-black/30">
            <span>User</span>
            <span>Role</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-zinc-400">
              Loading users…
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-zinc-400">
              No users found
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] px-8 py-5 items-center hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={
                        user.picture ||
                        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                      }
                      className="h-12 w-12 rounded-full object-cover border border-white/10"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                        user.role === "admin"
                          ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border-[var(--color-secondary)]/30"
                          : "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30"
                      }`}
                    >
                      <Shield size={12} />
                      {user.role}
                    </span>
                  </div>

                  <div>
                    {user.isLoggedIn ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-400/20">
                        <span className="h-2 w-2 bg-green-400 rounded-full" />
                        Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                        <span className="h-2 w-2 bg-zinc-400 rounded-full" />
                        Offline
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    {user.isLoggedIn && (
                      <button className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-red-400 border border-red-400/20 hover:bg-red-500/10 transition">
                        <LogOut size={15} />
                        Logout
                      </button>
                    )}

                    <button
                      onClick={() => deleteUser(user._id)}
                      disabled={deletingId === user._id}
                      className={`h-9 w-9 flex items-center justify-center rounded-lg border transition ${
                        deletingId === user._id
                          ? "border-zinc-600 text-zinc-600 cursor-not-allowed"
                          : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                      }`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;