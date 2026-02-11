import { MoreVertical } from "lucide-react";
import { getFileIcon } from "../Utilities/getIcon";
import { useState } from "react";
import ContextMenu from "./ContextMenu";
import RenameDirectoryModal from "./RenameDirectoryModal";
import { Link } from "react-router";
import ShareModal from "./ShareModal";

export default function DirectoryRow({ isSharedDirectory, isOwner, role, directory, selectedRow, renameDirectoryHandler, deleteDirectoryHandler, setSelectedRow, currentUser, isAdminDirectory=false }) {
    const { _id, name, userId } = directory;
    const id = _id.toString();
    const [RenameModalOpen, setRenameModalOpen] = useState(false);
    const { icon: Icon, color } = getFileIcon("folder");
    const [menuPos, setMenuPos] = useState(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    function openMenu(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const menuWidth = 160;
        const menuHeight = 160;
        const padding = 8;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = rect.left - menuWidth;
        if (x < padding) {
            x = Math.min(rect.right + padding, viewportWidth - menuWidth - padding);
        }

        let y = rect.bottom + padding;
        if (y + menuHeight > viewportHeight) {
            y = Math.max(rect.top - menuHeight - padding, padding);
        }

        setMenuPos({ x, y });
    }

    function closeMenu() {
        setMenuPos(null);
    }

    const toLinkPath = isSharedDirectory ? `/share/directory/${id}/view` : isAdminDirectory ? `/user/${userId._id.toString()}/directory/${id}` : `/directory/${id}`;

    return (
        <>
            <tr onClick={() => setSelectedRow(id)} className={`bg-black/20 border-b border-white/5 hover:bg-white/5 transition backdrop-blur-lg ${selectedRow === id ? "bg-white/10" : ""}`}>
                <td className="px-4 py-3 cursor-pointer">
                    <Link to={toLinkPath} className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 icon-glow">
                            <Icon className={color} />
                        </div>
                        <p className="truncate max-w-[350px]">{name}</p>
                    </Link>
                </td>

                <td className="px-4 py-3 text-gray-300">
                    --
                </td>

                <td className="px-4 py-3">
                    <div className="flex items-end gap-1">
                        <img referrerPolicy="no-referrer" src={userId?.picture} alt={userId?.name || "User"} className="w-6 h-6 rounded-full" />
                        <span className="text-gray-400 truncate">{userId?.email === currentUser.email ? "Me" : userId?.email}</span>
                    </div>
                </td>

                <td className="px-8 py-3 text-right relative">
                    <button onClick={(e) => openMenu(e)}>
                        <MoreVertical className="w-5 h-5 text-gray-300 hover:text-white" />
                    </button>
                    {menuPos && (
                        <ContextMenu
                            x={menuPos.x}
                            y={menuPos.y}
                            onRename={() => {
                                setRenameModalOpen(true)
                                setMenuPos(null);
                            }}
                            onDownload={() => alert("Download")}
                            onDelete={() => {
                                deleteDirectoryHandler(id, role);
                                setMenuPos(null);
                            }}
                            onClose={closeMenu}
                            isDirectory={true}
                            setShareModalOpen={setShareModalOpen}
                            directoryId={id}
                            role={role}
                            toLinkPath={toLinkPath}
                            isOwner={isOwner}
                        />
                    )}
                </td>

            </tr>
            {shareModalOpen && (
                <ShareModal
                    open={shareModalOpen}
                    resourceId={id}
                    onClose={() => setShareModalOpen(false)}
                    isDirectory={true}
                />
            )}
            {RenameModalOpen && <RenameDirectoryModal role={role} directoryId={id} directoryname={name} onClose={() => setRenameModalOpen(false)} renameDirectoryHandler={renameDirectoryHandler} />}
        </>
    );
}