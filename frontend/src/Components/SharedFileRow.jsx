import { MoreVertical } from "lucide-react";
import { getFileIcon } from "../Utilities/getIcon";
import { formatFileSize } from "../Utilities/SizeConverter";
import { useState } from "react";
import ContextMenu from "./ContextMenu";
import RenameFileModal from "./RenameFileModal";
import ShareModal from "./ShareModal";
import SharedUsersDropdown from "./SharedUsersDropdown";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";

export default function SharedFileRow({
    file,
    renameFileHandler,
    deleteFileHandler,
    selectedRow,
    setSelectedRow,
    toLink,
    role,
    fetchSharedFiles,
    currentSharedUsers
}) {
    const { _id: id, name, extension, size, userId } = file;
    const dirId = file.parentDirectoryId;

    const readableSize = formatFileSize(size);
    const { icon: Icon, color } = getFileIcon(extension);

    const [menuPos, setMenuPos] = useState(null);
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);

    const { user, loadingUser, fetchDirectoryContents } = useAppContext();
    if (loadingUser) return null;

    function openMenu(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPos({ x: rect.left - 160, y: rect.bottom + 8 });
    }

    function closeMenu() {
        setMenuPos(null);
    }

    const updateUserRole = async (targetUserId, newRole) => {
        const response = await fetch("http://localhost:4000/share/update-role", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                fileId: id,
                userId: targetUserId,
                role: newRole
            })
        });
        const data = await response.json();
        if (data.success) {
            fetchDirectoryContents(dirId);
            fetchSharedFiles?.();
            toast.success("User role updated successfully");
        }
    };

    return (
        <>
            <tr
                onClick={() => setSelectedRow(id)}
                className={`
                bg-black/20 border-b border-white/5
                hover:bg-white/5 transition
                ${selectedRow === id ? "bg-white/10" : ""}
                `}
            >
                <td className="px-4 py-3">
                    <a href={toLink} className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5">
                            <Icon className={color} />
                        </div>
                        <p className="truncate max-w-[350px]">{name}</p>
                    </a>
                </td>

                <td className="px-4 py-3 text-gray-300">
                    {readableSize}
                </td>

                <td className="px-4 py-3">
                    {currentSharedUsers.length > 0 ? (
                        <SharedUsersDropdown
                            resource={file}
                            currentUser={user}
                            onRoleChange={updateUserRole}
                            currentSharedUsers={currentSharedUsers}
                        />
                    ) : (
                        <div className="flex items-center gap-1">
                            <img referrerPolicy="no-referrer" src={user?.picture} alt={user?.name || "User"} className="w-6 h-6 rounded-full" />
                            <span className="text-gray-400">Me</span>
                        </div>
                    )}
                </td>

                <td className="px-8 py-3 text-right relative">
                    <button onClick={openMenu}>
                        <MoreVertical className="w-5 h-5 text-gray-300 hover:text-white" />
                    </button>

                    {menuPos && (
                        <ContextMenu
                            x={menuPos.x}
                            y={menuPos.y}
                            onRename={() => {
                                setRenameModalOpen(true);
                                setMenuPos(null);
                            }}
                            onDelete={() => {
                                deleteFileHandler(id);
                                setMenuPos(null);
                            }}
                            onClose={closeMenu}
                            isDirectory={false}
                            setShareModalOpen={setShareModalOpen}
                            toLink={toLink}
                            role={role}
                        />
                    )}
                </td>
            </tr>

            {shareModalOpen && (
                <ShareModal
                    open={shareModalOpen}
                    resourceId={id}
                    onClose={() => setShareModalOpen(false)}
                    isDirectory={false}
                />
            )}

            {renameModalOpen && (
                <RenameFileModal
                    fileId={id}
                    filename={name}
                    renameFileHandler={renameFileHandler}
                    onClose={() => setRenameModalOpen(false)}
                />
            )}
        </>
    );
}
