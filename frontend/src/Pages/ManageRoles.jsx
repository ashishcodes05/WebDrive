import { useEffect, useState } from "react";
import {
  Shield,
  Lock,
  ChevronDown,
  Crown,
  UserCog,
  User as UserIcon,
} from "lucide-react";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import BackButton from "../Components/BackButton";

const roles = ["admin", "manager", "user"];

const roleMeta = {
  owner: {
    label: "Owner",
    icon: Crown,
    style: "text-yellow-400 bg-yellow-500/10 border-yellow-400/30",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    style:
      "text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 border-[var(--color-secondary)]/30",
  },
  manager: {
    label: "Manager",
    icon: UserCog,
    style:
      "text-[var(--color-primary)] bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30",
  },
  user: {
    label: "User",
    icon: UserIcon,
    style: "text-zinc-300 bg-zinc-500/10 border-zinc-500/30",
  },
};

const ManageRoles = () => {
  const BASE_URL = "http://localhost:4000";
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/getAllUsers`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id, role) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`${BASE_URL}/admin/change-role/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role } : u))
        );
        toast.success("Role updated");
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    if (user && !["owner", "admin", "manager"].includes(user.role)) {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [user]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-10 py-8">
      <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-40"
            style={{ background: "var(--color-primary-accent)" }}
          />
          <div
            className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full blur-[140px] opacity-30"
            style={{ background: "var(--color-secondary-accent)" }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-[600px] h-[300px] rounded-full blur-[160px] opacity-20"
            style={{ background: "var(--color-secondary)" }}
          />
        </div>
      <div className="max-w-7xl mx-auto">
        <div className="py-4">
          <BackButton />
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            <UserCog className="inline-block mr-2 mb-1" size={24} />
            Role Management
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Manage user access levels across Webdrive
          </p>
        </div>

        <div className="bg-[var(--color-card-bg)] border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2.5fr_2.5fr_1.5fr_1.5fr] px-8 py-4 text-xs uppercase tracking-wider text-[var(--color-text-secondary)] bg-black/30">
            <span>User</span>
            <span>Email</span>
            <span>Current Role</span>
            <span className="text-right">Change Role</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-zinc-400">
              Loading users…
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {users.map((u) => {
                const isOwner = u.role === "owner";
                const isSelf = u._id === user?._id;
                const RoleIcon = roleMeta[u.role].icon;

                return (
                  <div
                    key={u._id}
                    className="grid grid-cols-[2.5fr_2.5fr_1.5fr_1.5fr] px-8 py-5 items-center hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                       referrerPolicy="no-referrer"
                        src={
                          u.picture ||
                          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                        }
                        className="h-10 w-10 rounded-full object-cover border border-white/10"
                      />
                      <span className="text-white font-medium truncate">
                        {u.name}
                      </span>
                    </div>

                    <span className="text-sm text-[var(--color-text-secondary)] truncate">
                      {u.email}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${roleMeta[u.role].style} px-2 py-1 rounded-lg inline-flex items-center gap-2`}
                      >
                        <RoleIcon className={`size-6`} />
                        {roleMeta[u.role].label}
                      </span>
                    </div>

                    <div className="flex justify-end">
                      {isOwner ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-yellow-400/30 text-yellow-400 bg-yellow-500/10">
                          <Lock size={12} />
                          Locked
                        </span>
                      ) : (
                        <div className="relative">
                          <select
                            value={u.role}
                            disabled={isSelf || updatingId === u._id}
                            onChange={(e) =>
                              changeRole(u._id, e.target.value)
                            }
                            className="appearance-none bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm text-white pr-8 hover:bg-black/40 transition disabled:opacity-50"
                          >
                            {roles.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRoles;
