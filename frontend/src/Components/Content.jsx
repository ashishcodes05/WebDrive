import { useEffect, useState } from "react";
import FileRow from "./FileRow";
import DetailCard from "./DetailCard";
import DirectoryRow from "./DirectoryRow";
import { useAppContext } from "../Context/AppContext";
import toast from 'react-hot-toast';
import { useNavigate, useParams } from "react-router";
import Loader from "./Loader";

const Content = () => {
  const BASE_URL = "http://localhost:4000"
  const {dirId} = useParams();
  const [sortBy, setSortBy] = useState("name-asc");
  const { files, setFiles, directories, setDirectories, fetchDirectoryContents, user, loadingUser } = useAppContext();
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  const renameFileHandler = async (fileId, newFilename) => {
    try {
      const response = await fetch(`${BASE_URL}/file/${fileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ newFilename }),
      }
      );
      const data = await response.json();
      if (data.success) {
        fetchDirectoryContents();
        toast.success("File renamed successfully!");
      } else {
        toast.error("File rename failed: " + data.message);
      }
    } catch (err) {
      console.error("Error renaming file:", err);
    }
  }

  const deleteFileHandler = async (fileId) => {
    try {
      const response = await fetch(`${BASE_URL}/file/${fileId}`, {
        method: "DELETE",
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        fetchDirectoryContents(dirId);
        toast.success("File deleted successfully!");
      } else {
        toast.error("File deletion failed: " + data.message);
      }
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }

  const renameDirectoryHandler = async (directoryId, newDirectoryName) => {
    try {
      const response = await fetch(`${BASE_URL}/directory/${directoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ newDirectoryName }),
      }
      );
      const data = await response.json();
      if (data.success) {
        fetchDirectoryContents(dirId);
        toast.success("Directory renamed successfully!");
      } else {
        toast.error("Directory rename failed: " + data.message);
      }
    } catch (err) {
      console.error("Error renaming directory:", err);
    }
  }

  const deleteDirectoryHandler = async (directoryId) => {
    try {
      const response = await fetch(`${BASE_URL}/directory/${directoryId}`, {
        method: "DELETE",
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        fetchDirectoryContents(dirId);
        toast.success("Directory deleted successfully!");
      } else {
        toast.error("Directory deletion failed: " + data.message);
      }
    } catch (err) {
      console.error("Error deleting directory:", err);
    }
  }

  const sortedFiles = [...files].sort((a, b) => {
    if (sortBy === "name-asc") return a.filename.localeCompare(b.filename);
    if (sortBy === "name-desc") return b.filename.localeCompare(a.filename);
    if (sortBy === "size-asc") return a.size - b.size;
    if (sortBy === "size-desc") return b.size - a.size;
    return 0;
  });

  const sortedDirectories = [...directories].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  useEffect(() => {
    fetchDirectoryContents(dirId);
  }, [dirId]);

  if(loadingUser){
    return <Loader />;
  }

  if(!user){
    navigate("/login");
    return;
  }

  return (
    <div className="grow bg-background px-32 py-8 flex flex-col items-center space-y-6">
      <div className="flex space-x-6">
        <DetailCard name="Total Files" count={files.length} />
        <DetailCard name="Total Folders" count={directories.length} />
        <DetailCard name="Storage Used" count={"1.5 GB"} />
      </div>
      <div className="bg-card-bg border border-card-bg rounded-xl min-w-5xl shadow-md overflow-hidden">
        <table className="border-collapse overflow-y-auto max-h-[calc(100vh-164px)] block scrollbar-none">
          <thead className="bg-gray-800 border-b border-white/5 sticky top-0 z-10 text-gray-400 text-left text-sm">
            <tr>
              <th className="px-4 py-3 w-[50%]">
                <div className="flex items-center gap-2">
                  Name
                  <button
                    onClick={() =>
                      setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc")
                    }
                    className="text-xs bg-white/10 px-2 py-1 rounded"
                  >
                    {sortBy === "name-asc" ? "▲" : "▼"}
                  </button>
                </div>
              </th>
              <th className="px-4 py-3 w-[20%]">
                <div className="flex items-center gap-2">
                  Size
                  <button
                    onClick={() =>
                      setSortBy(sortBy === "size-asc" ? "size-desc" : "size-asc")
                    }
                    className="text-xs bg-white/10 px-2 py-1 rounded"
                  >
                    {sortBy === "size-asc" ? "▲" : "▼"}
                  </button>
                </div>
              </th>
              <th className="px-4 py-3 w-[15%]">Type</th>
              <th className="px-8 py-3 w-[10%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white text-sm">
            {sortedDirectories.map((dir, idx) => (
              <DirectoryRow selectedRow={selectedRow} renameDirectoryHandler={renameDirectoryHandler} deleteDirectoryHandler={deleteDirectoryHandler} setSelectedRow={setSelectedRow} key={idx} directory={dir} />
            ))}
            {sortedFiles.map((file, idx) => (
              <FileRow selectedRow={selectedRow} deleteFileHandler={deleteFileHandler} renameFileHandler={renameFileHandler} setSelectedRow={setSelectedRow} key={idx} file={file} />
            ))}
            {sortedFiles.length === 0 && sortedDirectories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6"> No files or directories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;
