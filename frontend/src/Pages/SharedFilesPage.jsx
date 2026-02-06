import { useEffect, useState } from "react";
import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  Cloud,
} from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useAppContext } from "../Context/AppContext";
import SharedFileRow from "../Components/SharedFileRow";
import SharedDirectoryRow from "../Components/SharedDirectoryRow";

const SharedFilesPage = () => {
  const BASE_URL = "http://localhost:4000";
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [sharedUsers, setSharedUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const { user, loadingUser } = useAppContext();

  const fetchSharedFiles = async () => {
    const res = await fetch(`${BASE_URL}/share/directory`, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      setFiles(data.files);
      setDirectories(data.directories);
    }
    setLoading(false);
  };

  const fetchSharedUsers = async (files, directories) => {
    const fileResources = files.map((f) => ({
      resourceId: f._id,
      resourceType: "file",
    }));
    const dirResources = directories.map((d) => ({
      resourceId: d._id,
      resourceType: "directory",
    }));
    const resources = [...fileResources, ...dirResources];
    if (resources.length === 0) {
      setSharedUsers({});
      return;
    }
    const res = await fetch(`${BASE_URL}/share/shared-users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ resources }),
    });
    const data = await res.json();
    if (data.success) setSharedUsers(data.sharedUsers);
  };

  const renameFileHandler = async (fileId, newFilename) => {
    const res = await fetch(`${BASE_URL}/share/file/${fileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ newFilename }),
    });
    const data = await res.json();
    if (data.success) {
      await fetchSharedFiles();
      toast.success("File renamed successfully");
    } else {
      toast.error(data.message);
    }
  };

  const deleteFileHandler = async (fileId) => {
    const res = await fetch(`${BASE_URL}/share/file/${fileId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      await fetchSharedFiles();
      toast.success("File deleted successfully");
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (!loadingUser) fetchSharedFiles();
  }, [loadingUser, user]);

  useEffect(() => {
    if (!loadingUser) fetchSharedUsers(files, directories);
  }, [loadingUser, files, directories]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-10 py-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-4 mb-10">
          <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-accent to-secondary-accent shadow-lg">
            <Cloud size={26} className="text-white" />
          </div>
          <span className="text-2xl font-semibold text-white">
            Web<span className="text-secondary-accent">Drive</span>
          </span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Shared with Others
          </h1>
          <p className="text-sm text-text-secondary">
            Files you have shared with others
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card-bg/80 backdrop-blur-xl overflow-hidden">
          <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background/80 border-b border-white/10">
                <tr className="text-text-secondary">
                  <th className="px-4 py-3 text-left w-[50%]">Name</th>
                  <th className="px-4 py-3 text-left w-[20%]">Size</th>
                  <th className="px-4 py-3 text-left w-[15%]">Owner</th>
                  <th className="px-6 py-3 text-right w-[10%]">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-white">
                {directories.map((directory) => (
                  <SharedDirectoryRow
                    key={directory._id}
                    directory={directory}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    currentUser={user}
                    currentSharedUsers={
                      sharedUsers[directory._id.toString()] || []
                    }
                    isSharedDirectory={true}
                  />
                ))}

                {files.map((file) => (
                  <SharedFileRow
                    key={file._id}
                    file={file}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    renameFileHandler={renameFileHandler}
                    deleteFileHandler={deleteFileHandler}
                    toLink={`${BASE_URL}/share/file/${file._id}/view`}
                    currentSharedUsers={
                      sharedUsers[file._id.toString()] || []
                    }
                  />
                ))}

                {files.length === 0 && directories.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-gray-400"
                    >
                      No shared files or folders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedFilesPage;
