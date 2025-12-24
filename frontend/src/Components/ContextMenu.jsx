import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

export default function ContextMenu({ x, y, onRename, onDelete, fileId, directoryId, onClose, isDirectory }) {
    const BASE_URL = "http://localhost:4000";
    const menuRef = useRef();

    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return createPortal(
        <div
            ref={menuRef}
            style={{
                position: "fixed",
                top: y,
                left: x,
                zIndex: 9999,
            }}
            className="
                bg-[#0f1629]/95
                border border-white/10
                rounded-xl
                shadow-xl shadow-black/50
                animate-pop
                w-40
                overflow-hidden
                backdrop-blur-sm
            "
        >
            {!isDirectory ? (<a
                href={`${BASE_URL}/file/${fileId}`}
                className="
                    block px-4 py-2.5 
                    text-gray-200 text-sm 
                    hover:bg-white/10 transition
                "
            >
                Open
            </a>) : (
                <Link to={`/directory/${directoryId}`} className="block px-4 py-2.5 
                    text-gray-200 text-sm 
                    hover:bg-white/10 transition">
                    Open
                </Link>
            )}

            <button
                onClick={onRename}
                className="
                    w-full text-left px-4 py-2.5 
                    text-gray-200 text-sm 
                    hover:bg-white/10 transition
                "
            >
                Rename
            </button>

            {!isDirectory && (
                <a
                    href={`${BASE_URL}/file/${fileId}?action=download`}
                    className="
                        block px-4 py-2.5 
                        text-gray-200 text-sm 
                        hover:bg-white/10 transition
                    "
                >
                    Download
                </a>
            )}

            <button
                onClick={onDelete}
                className="
                    w-full text-left px-4 py-2.5 
                    text-red-400 text-sm 
                    hover:bg-red-500/20 transition
                "
            >
                Delete
            </button>
        </div>,
        document.querySelector("#portal-root")
    );
}
