import { MoreVertical } from "lucide-react";
import { getFileIcon } from "../Utilities/getIcon";
import { formatFileSize } from "../Utilities/SizeConverter";
import { useState } from "react";
import ContextMenu from "./ContextMenu";
import RenameModal from "./RenameFileModal";
import RenameDirectoryModal from "./RenameDirectoryModal";
import { Link } from "react-router";

export default function DirectoryRow({directory, selectedRow, renameDirectoryHandler, deleteDirectoryHandler, setSelectedRow }) {
    const { _id, name } = directory;
    const id = _id.toString();
    const [RenameModalOpen, setRenameModalOpen] = useState(false);
    const { icon: Icon, color } = getFileIcon("folder");
    const [menuPos, setMenuPos] = useState(null);

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

    return (
        <>
            <tr onClick={() => setSelectedRow(id)} className={`border-b border-white/5 hover:bg-white/5 transition ${selectedRow === id ? "bg-white/10" : ""}`}>
                <td className="px-4 py-3 cursor-pointer">
                    <Link to={`/directory/${id}`} className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${color}`} />
                        <p className="truncate max-w-[350px]">{name}</p>
                    </Link>
                </td>

                <td className="px-4 py-3 text-gray-300">
                    --
                </td>

                <td className="px-4 py-3 text-gray-300 uppercase">
                    FOLDER
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
                                deleteDirectoryHandler(id);
                                setMenuPos(null);
                            }}
                            onClose={closeMenu}
                            isDirectory={true}
                            directoryId={id}
                        />
                    )}
                </td>

            </tr>
            {RenameModalOpen && <RenameDirectoryModal directoryId={id} directoryname={name} onClose={() => setRenameModalOpen(false)} renameDirectoryHandler={renameDirectoryHandler} />}
        </>
    );
}