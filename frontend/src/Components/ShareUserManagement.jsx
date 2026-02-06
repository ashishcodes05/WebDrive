import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const ROLES = ["viewer", "editor", "owner"];

const UsersManagementPage = () => {
  const BASE_URL = "http://localhost:4000";
  const { resourceId, resourceType } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSharedUsers = async () => {
    const res = await fetch(`${BASE_URL}/share/shared-users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        resources: [{ resourceId, resourceType }]
      })
    });

    const data = await res.json();
    if (data.success) {
      setUsers(data.sharedUsers[resourceId] || []);
    }
    setLoading(false);
  };

  const updateRole = async (userId, role) => {
    const res = await fetch(`${BASE_URL}/share/update-role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ resourceId, userId, role })
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Role updated");
      fetchSharedUsers();
    } else {
      toast.error(data.message);
    }
  };

  const revokeAccess = async (userId) => {
    const res = await fetch(`${BASE_URL}/share/revoke`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ resourceId, userId })
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Access revoked");
      fetchSharedUsers();
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    fetchSharedUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-10 py-8 text-white">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-text-secondary hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-2xl font-semibold mb-6">
          Manage Access
        </h1>

        <div className="rounded-xl border border-white/10 bg-card-bg/80 backdrop-blur-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-text-secondary">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.userId}>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={user.picture}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                    <span>{user.email}</span>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateRole(user.userId, e.target.value)
                      }
                      className="bg-transparent border border-white/20 rounded-lg px-3 py-1"
                    >
                      {ROLES.map((role) => (
                        <option
                          key={role}
                          value={role}
                          disabled={user.role === "owner" && role !== "owner"}
                        >
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {user.role !== "owner" && (
                      <button
                        onClick={() => revokeAccess(user.userId)}
                        className="text-red-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-text-secondary"
                  >
                    No users have access
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagementPage;
