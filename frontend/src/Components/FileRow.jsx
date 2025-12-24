import { MoreVertical } from "lucide-react";
import { getFileIcon } from "../Utilities/getIcon";
import { formatFileSize } from "../Utilities/SizeConverter";
import { useState } from "react";
import ContextMenu from "./ContextMenu";
import RenameFileModal from "./RenameFileModal";

export default function FileRow({ file, renameFileHandler, deleteFileHandler, selectedRow, setSelectedRow }) {
    const BASE_URL = "http://localhost:4000"
    const {_id : id, filename, extension, size } = file;
    const [RenameModalOpen, setRenameModalOpen] = useState(false);
    const readableSize = formatFileSize(size);
    const { icon: Icon, color } = getFileIcon(extension);
    const [menuPos, setMenuPos] = useState(null);

    function openMenu(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const menuWidth = 160;
        const menuHeight = 200;
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
                    <a href={`${BASE_URL}/file/${id}`} className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${color}`} />
                        <p className="truncate max-w-[350px]">{filename}</p>
                    </a>
                </td>

                <td className="px-4 py-3 text-gray-300">
                    {readableSize}
                </td>

                <td className="px-4 py-3 text-gray-300 uppercase">
                    {extension.slice(1).toUpperCase()}
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
                            fileId={id}
                            onDelete={() => {
                                deleteFileHandler(id);
                                setMenuPos(null);
                            }}
                            onClose={closeMenu}
                            isDirectory={false}
                        />
                    )}
                </td>

            </tr>
            {RenameModalOpen && <RenameFileModal fileId={id} filename={filename} renameFileHandler={renameFileHandler} onClose={() => setRenameModalOpen(false)} />}
        </>
    );
}