import { useEffect, useState } from "react";
import { Users, CircleDot, Trash2, LogOut, Shield } from "lucide-react";
import { useAppContext } from "../Context/AppContext";
import ForceDeleteModal from "../Components/ForceDeleteModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const UsersPage = () => {
  const BASE_URL = "http://localhost:4000";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [forceDeleteModalOpen, setForceDeleteModalOpen] = useState(false);

  const { user } = useAppContext();
  const navigate = useNavigate();
  const fetchUsers = async () => {
    console.log(user?.role)
    try {
      const res = await fetch(`${BASE_URL}/admin/getAllUsers`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } finally {
      setLoading(false);
    }
  }
  const deleteUser = async (id) => {
    try {
      setDeletingId(id);
      const res = await fetch(`${BASE_URL}/admin/force-delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        toast.error(data.message || "Error deleting user");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const toggleUserStatus = async (id) => {
    const res = await fetch(`${BASE_URL}/admin/toggle-status/${id}`, {
      method: "PATCH",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      setLoading(true);
      fetchUsers();
    } else {
      toast.error(data.message || "Error toggling user status");
    }
  };

  const forceLogoutUser = async (id) => {
    const res = await fetch(`${BASE_URL}/admin/force-logout/${id}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isLoggedIn: false } : u))
      );
    } else {
      toast.error(data.message || "Error logging out user");
    }
  };
  useEffect(() => {
    if(user && user?.role != "owner" && user?.role !== "admin" && user?.role !== "manager"){
      navigate('/');
      return;
    };
    setLoading(true);
    fetchUsers();
  }, [user]);


  const online = users.filter((u) => u.isLoggedIn && !u.isDisabled).length;
  const offline = users.length - online;
  const isManager = user?.role === "manager";
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
            <div className="py-20 text-center text-zinc-400">Loading users…</div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-zinc-400">No users found</div>
          ) : (
            <div className="divide-y divide-white/5">
              {users.map((u) => {
                return (
                  <div
                    key={u._id}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr] px-8 py-5 items-center hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        referrerPolicy="no-referrer"
                        src={
                          u.picture ||
                          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                        }
                        className="h-12 w-12 rounded-full object-cover border border-white/10"
                      />
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">
                          {u.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)] truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                          u.role === "admin"
                            ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border-[var(--color-secondary)]/30"
                            : "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30"
                        }`}
                      >
                        <Shield size={12} />
                        {u.role}
                      </span>
                    </div>

                    <div>
                      {u.isDisabled ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-400/20">
                          <span className="h-2 w-2 bg-yellow-400 rounded-full" />
                          Disabled
                        </span>
                      ) : u.isLoggedIn ? (
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
                      <button
                        onClick={() => toggleUserStatus(u._id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition ${
                          u.isDisabled
                            ? "text-green-400 border-green-400/20 hover:bg-green-500/10"
                            : "text-yellow-400 border-yellow-400/20 hover:bg-yellow-500/10"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            u.isDisabled
                              ? "bg-green-400"
                              : "bg-yellow-400"
                          }`}
                        />
                        {u.isDisabled ? "Enable" : "Disable"}
                      </button>

                      {u.isLoggedIn && (
                        <button
                        onClick={() => {
                          forceLogoutUser(u._id)
                        }}
                          disabled={isManager}
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition ${
                            isManager
                              ? "text-zinc-500 border-zinc-600 cursor-not-allowed"
                              : "text-red-400 border-red-400/20 hover:bg-red-500/10"
                          }`}
                        >
                          <LogOut size={15} />
                          Logout
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setForceDeleteModalOpen(true)
                          setDeletingId(u._id)
                        }}
                        disabled={isManager}
                        className={`h-9 w-9 flex items-center justify-center rounded-lg border transition ${
                          isManager
                            ? "border-zinc-600 text-zinc-600 cursor-not-allowed"
                            : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                        }`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ForceDeleteModal open={forceDeleteModalOpen} onClose={() => setForceDeleteModalOpen(false)} onConfirm={() => {
        deleteUser(deletingId)
        setForceDeleteModalOpen(false);
      }} />
    </div>
  );
};

export default UsersPage;