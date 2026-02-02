import { useEffect, useState } from "react";
import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  Star,
  Cloud,
} from "lucide-react";
import FileRow from "../Components/FileRow";
import { Link } from "react-router";

const getFileIcon = (ext) => {
  const e = ext.toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(e)) return FileImage;
  if (["mp4", "mkv", "mov"].includes(e)) return FileVideo;
  if (["mp3", "wav"].includes(e)) return FileAudio;
  if (["zip", "rar", "7z"].includes(e)) return FileArchive;
  if (["pdf", "doc", "docx", "txt"].includes(e)) return FileText;
  return File;
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const SharedFilesPage = () => {
  const BASE_URL = "http://localhost:4000";
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchSharedFiles = async () => {
    try {
      const res = await fetch(`${BASE_URL}/share/files`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setFiles(data.files || []);
    } finally {
      setLoading(false);
    }
  };

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
        fetchSharedFiles();
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
        fetchSharedFiles();
        toast.success("File deleted successfully");
      } else toast.error(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-10 py-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--color-primary)]/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-[var(--color-secondary)]/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-4 mb-10">
          <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-accent to-secondary-accent shadow-lg shadow-primary-accent/30">
            <Cloud size={26} className="text-white" />
          </div>

          <span className="text-2xl font-semibold text-white tracking-tight">
            Web<span className="text-secondary-accent">Drive</span>
          </span>
        </Link>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Shared with Others
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Files you have shared with others
          </p>
        </div>

        <div className="relative z-10 w-full max-w-7xl rounded-2xl border border-white/10 bg-card-bg/80 backdrop-blur-xl shadow-xl shadow-black/40 overflow-hidden">
          <div className="max-h-[calc(100vh-240px)] overflow-y-auto scrollbar-none">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/10 text-text-secondary">
                <tr>
                  <th className="px-4 py-3 text-left w-[50%]">Name</th>
                  <th className="px-4 py-3 text-left w-[20%]">Size</th>
                  <th className="px-4 py-3 text-left w-[15%]">Type</th>
                  <th className="px-6 py-3 text-right w-[10%]">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-white">
                {files.map((file) => (
                  <FileRow
                    key={file._id}
                    file={file}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    renameFileHandler={renameFileHandler}
                    deleteFileHandler={deleteFileHandler}
                  />
                ))}

                {files.length === 0 && (
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
    </div>
  );
};

export default SharedFilesPage;
