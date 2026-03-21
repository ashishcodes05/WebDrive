import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Shield,
  Eye,
  Edit3,
  Crown,
  Trash2,
} from "lucide-react";
import BackButton from "./BackButton";

const ROLE_META = {
  viewer: {
    label: "viewer",
    icon: Eye,
    color: "text-blue-400",
  },
  editor: {
    label: "editor",
    icon: Edit3,
    color: "text-emerald-400",
  },
  owner: {
    label: "owner",
    icon: Crown,
    color: "text-yellow-400",
  },
};

const UsersManagementPage = () => {
  const BASE_URL = "http://localhost:4000";
  const { resourceId, resourceType } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSharedUsers = async () => {
    const res = await fetch(
      `${BASE_URL}/share/${resourceType}/${resourceId}/manage`,
      { credentials: "include" }
    );
    const data = await res.json();
    if (data.success) setUsers(data.users);
    setLoading(false);
  };

  const updateRole = async (userId, role) => {
    const res = await fetch(`${BASE_URL}/share/update-role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ resourceId, userId, role }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Role updated");
      fetchSharedUsers();
    } else toast.error(data.message);
  };

  const revokeAccess = async (userId) => {
    const res = await fetch(`${BASE_URL}/share/revoke`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ resourceId, resourceType, userId }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Access removed");
      fetchSharedUsers();
    } else toast.error(data.message);
  };

  useEffect(() => {
    fetchSharedUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-8 py-10 text-white">
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
      <div className="max-w-5xl mx-auto">
        <div className="py-4">
          <BackButton label="back" />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-11 w-11 rounded-xl bg-primary-accent/20 flex items-center justify-center">
            <Shield className="text-primary-accent" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Manage Access</h1>
            <p className="text-sm text-text-secondary">
              Control who can access and modify this {resourceType}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card-bg/80 backdrop-blur-xl overflow-hidden">
          {users.length === 0 ? (
            <div className="py-12 text-center text-text-secondary">
              No users have access
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {users.map((user) => {
                const RoleIcon = ROLE_META[user.role].icon;

                return (
                  <li
                    key={user.userId}
                    className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        referrerPolicy="no-referrer"
                        src={user.picture}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <div className="flex items-center gap-1 text-xs text-text-secondary">
                          <RoleIcon
                            size={14}
                            className={ROLE_META[user.role].color}
                          />
                          {ROLE_META[user.role].label}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          updateRole(user.userId, e.target.value)
                        }
                        disabled={user.role === "owner"}
                        className="bg-background border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent disabled:opacity-50"
                      >
                        {Object.keys(ROLE_META).map((role) => (
                          ROLE_META[role].label === "owner" ? null : (
                          <option key={role} value={role}>
                            {ROLE_META[role].label}
                          </option>
                        )))}
                      </select>

                      {user.role !== "owner" && (
                        <button
                          onClick={() => revokeAccess(user.userId)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagementPage;
