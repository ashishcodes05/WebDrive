import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import {
  FolderOpen,
  File,
  Pencil,
  Download,
  Trash2,
  Share,
  Share2,
  UserCog2,
} from "lucide-react";

export default function ContextMenu({
  x,
  y,
  onRename,
  onDelete,
  fileId,
  directoryId,
  onClose,
  isDirectory,
  isOwner=false,
  setShareModalOpen,
  setMenuPos,
  role,
  toLinkPath
}) {
  const BASE_URL = "http://localhost:4000";
  const menuRef = useRef(null);
  console.log(fileId)
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const itemClass =
    "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition w-full";
  
  const isViewer = role === "viewer";
  const manageAccessLink = `/share/users/${isDirectory ? "directory" : "file"}/${isDirectory ? directoryId : fileId}`;

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: "fixed", top: y, left: x, zIndex: 9999 }}
      className="
        w-44
        bg-[#0f1629]/95
        border border-white/10
        rounded-xl
        shadow-xl shadow-black/50
        backdrop-blur-sm
        overflow-hidden
        animate-pop
      "
    >
      {!isDirectory ? (
        <a href={toLinkPath} className={itemClass}>
          <File className="w-4 h-4 text-primary-accent" />
          Open
        </a>
      ) : (
        <Link to={toLinkPath} className={itemClass}>
          <FolderOpen className="w-4 h-4 text-primary-accent" />
          Open
        </Link>
      )}

      {!isViewer && <button onClick={() => {
        setShareModalOpen(true);
        setMenuPos(null);
      }} className={itemClass}>
        <Share2 className="w-4 h-4 text-text-secondary" />
        Share
      </button>}
      {isOwner && <Link to={manageAccessLink} className={itemClass}>
        <UserCog2 className="w-4 h-4 text-text-secondary" />
        Manage Access
      </Link>}

        {!isViewer && (<button onClick={onRename} className={itemClass}>
          <Pencil className="w-4 h-4 text-text-secondary" />
          Rename
        </button>)}

      {!isDirectory && (
        <a
          href={`${toLinkPath}?action=download`}
          className={itemClass}
        >
          <Download className="w-4 h-4 text-emerald-400" />
          Download
        </a>
      )}
      
      {!isViewer && (
      <>
        <div className="h-px bg-white/10 my-1" />
        <button
          onClick={onDelete}
          className="
            flex items-center gap-3
            w-full px-4 py-2.5
            text-sm text-red-400
          hover:bg-red-500/20
          transition
        "
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
      </>
    )}
    </div>,
    document.querySelector("#portal-root")
  );
}