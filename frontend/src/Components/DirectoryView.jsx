import { use, useEffect, useState } from "react";
import { History, Star, Trash2, Search, X, UploadCloud, Share2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import FileRow from "./FileRow";
import DetailCard from "./DetailCard";
import DirectoryRow from "./DirectoryRow";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import Loader from "./Loader";
import Footer from "./Footer";

const DirectoryView = () => {
  const BASE_URL = "http://localhost:4000";
  const { dirId } = useParams();
  const navigate = useNavigate();

  const { files, directories, fetchDirectoryContents, loadingUser, user } =
    useAppContext();

  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const renameFileHandler = async (fileId, newFilename) => {
    try {
      const res = await fetch(`${BASE_URL}/file/${fileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newFilename }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDirectoryContents(dirId);
        toast.success("File renamed successfully");
      } else toast.error(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFileHandler = async (fileId) => {
    try {
      const res = await fetch(`${BASE_URL}/file/${fileId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        fetchDirectoryContents(dirId);
        toast.success("File deleted successfully");
      } else toast.error(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const renameDirectoryHandler = async (directoryId, newDirectoryName) => {
    try {
      const res = await fetch(`${BASE_URL}/directory/${directoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newDirectoryName }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDirectoryContents(dirId);
        toast.success("Folder renamed successfully");
      } else toast.error(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDirectoryHandler = async (directoryId) => {
    try {
      const res = await fetch(`${BASE_URL}/directory/${directoryId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        fetchDirectoryContents(dirId);
        toast.success("Folder deleted successfully");
      } else toast.error(data.message);
    } catch (err) {
      console.error(err);
    }
  };
  const loadPicker = () => {
    return new Promise((resolve) => {
      if (window.google?.picker) return resolve();

      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => window.gapi.load("picker", resolve);
      document.body.appendChild(script);
    });
  };

  const openDrivePicker = async (accessToken) => {
    await loadPicker();

    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .setOAuthToken(accessToken)
      .setCallback(async (data) => {
        if (data.action === "picked") {
          try {
            const res = await fetch(
              `${BASE_URL}/auth/import/google-drive/${dirId || ""}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  files: data.docs.map((d) => ({
                    id: d.id,
                    name: d.name,
                  })),
                  accessToken,
                }),
              }
            );

            const result = await res.json();
            if (result.success) {
              fetchDirectoryContents(dirId);
              toast.success("Files imported from Google Drive");
            } else {
              toast.error(result.message);
            }
          } catch (err) {
            console.error(err);
            toast.error("Google Drive import failed");
          }
        }
      })
      .build();

    picker.setVisible(true);
  };

  const googleLogin = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.readonly",
    onSuccess: (tokenResponse) => {
      openDrivePicker(tokenResponse.access_token);
    },
    onError: () => toast.error("Google authentication failed"),
  });

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDirectories = directories.filter((dir) =>
    dir.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.filename);
    if (sortBy === "name-desc") return b.name.localeCompare(a.filename);
    if (sortBy === "size-asc") return a.size - b.size;
    if (sortBy === "size-desc") return b.size - a.size;
    return 0;
  });

  const sortedDirectories = [...filteredDirectories].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  useEffect(() => {
    if (!loadingUser) {
      fetchDirectoryContents(dirId);
    }
  }, [loadingUser, dirId]);

  if (loadingUser) return <Loader />;

  return (
    <>
      <div className="relative grow bg-background px-20 py-8 flex flex-col items-center gap-6 min-h-screen">
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

        <div className="relative z-10 w-full max-w-7xl flex items-center justify-between gap-6">
          <div className="flex gap-6">
            <DetailCard name="Total Files" count={files.length} />
            <DetailCard name="Total Folders" count={directories.length} />
          </div>

          <div className="flex items-center gap-3">
            <div
              className="
              relative group
              w-92
              rounded-xl
              bg-card-bg/70 backdrop-blur-xl
              border border-white/10
              shadow-lg shadow-black/30
              transition
              focus-within:border-primary/40
              focus-within:shadow-primary/20
            "
            >
              <Search
                size={16}
                className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-text-secondary
                group-focus-within:text-primary-accent
                transition
              "
              />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files or folders"
                className="
                  w-full
                  bg-transparent
                  pl-9 pr-9 py-2.5
                  text-sm text-white
                  placeholder:text-text-secondary
                  outline-none
                "
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  p-1 rounded-md
                  text-text-secondary
                  hover:text-white
                  hover:bg-white/10
                  transition
                "
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/recent")}
                  className="group flex items-center gap-2 rounded-xl px-4 py-2.5 bg-card-bg/70 backdrop-blur-xl border border-white/10 text-sm text-text-main shadow-lg shadow-black/30 transition hover:bg-white/10"
                >
                  <History size={18} className="text-primary-accent" />
                  Recent
                </button>

                <button
                  onClick={() => navigate("/starred")}
                  className="group flex items-center gap-2 rounded-xl px-4 py-2.5 bg-card-bg/70 backdrop-blur-xl border border-white/10 text-sm text-text-main shadow-lg shadow-black/30 transition hover:bg-white/10"
                >
                  <Star size={18} className="text-primary-accent" />
                  Starred
                </button>

                <button
                  onClick={() => navigate("/bin")}
                  className="group flex items-center gap-2 rounded-xl px-4 py-2.5 bg-card-bg/70 backdrop-blur-xl border border-white/10 text-sm text-text-main shadow-lg shadow-black/30 transition hover:bg-red-500/10 hover:border-red-500/30"
                >
                  <Trash2 size={18} className="text-red-400" />
                  Bin
                </button>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => googleLogin()}
                  className="
                  group flex items-center gap-2
                  
                  rounded-xl px-4 py-2.5
                  bg-card-bg/70 backdrop-blur-xl
                  border border-white/10
                  text-sm text-text-main
                  shadow-lg shadow-black/30
                  transition hover:bg-white/10
                  "
                >
                  <UploadCloud size={18} className="text-primary-accent" />
                  Import from Google
                </button>
                <Link to="/share/files" className="group flex items-center gap-2 rounded-xl px-4 py-2.5 bg-card-bg/70 backdrop-blur-xl border border-white/10 text-sm text-text-main shadow-lg shadow-black/30 transition hover:bg-white/10">
                  <Share2 size={18} className="text-primary-accent" />
                  Shared Files
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl rounded-2xl border border-white/10 bg-card-bg/80 backdrop-blur-xl shadow-xl shadow-black/40 overflow-hidden">
          <div className="max-h-[calc(100vh-240px)] overflow-y-auto scrollbar-none">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/10 text-text-secondary">
                <tr>
                  <th className="px-4 py-3 text-left w-[50%]">Name</th>
                  <th className="px-4 py-3 text-left w-[20%]">Size</th>
                  <th className="px-4 py-3 text-left w-[15%]">Owner</th>
                  <th className="px-6 py-3 text-right w-[10%]">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-white">
                {sortedDirectories.map((dir) => (
                  <DirectoryRow
                    key={dir._id}
                    directory={dir}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    renameDirectoryHandler={renameDirectoryHandler}
                    deleteDirectoryHandler={deleteDirectoryHandler}
                    currentUser={user}
                  />
                ))}

                {sortedFiles.map((file) => {
                  let role = "viewer";

                  if (file.userId._id.toString() === user.id) {
                    role = "owner";
                  } else {
                    const sharedEntry = file.sharedWith?.find(
                      (u) => u.userId._id?.toString() === user.id
                    );
                    role = sharedEntry?.role ?? "viewer";
                  }

                  return (
                    <FileRow
                      key={file._id}
                      toLink={`${BASE_URL}/file/${file._id}`}
                      file={file}
                      selectedRow={selectedRow}
                      setSelectedRow={setSelectedRow}
                      renameFileHandler={renameFileHandler}
                      deleteFileHandler={deleteFileHandler}
                      role={role}
                      currentUser={file.userId._id}
                    />
                  );
                })}

                {sortedFiles.length === 0 &&
                  sortedDirectories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-gray-400">
                        No matching files or folders
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DirectoryView;