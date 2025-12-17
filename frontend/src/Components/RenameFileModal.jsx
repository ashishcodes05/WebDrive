import React, { useState } from "react";

const RenameFileModal = ({ onClose, fileId, filename, renameFileHandler }) => {
    const [newFileName, setNewFileName] = useState(filename);
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center">

            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            <div
                className="
                    relative z-50 w-full max-w-lg
                    bg-[#0f1629]/95 
                    border border-white/10 
                    rounded-2xl 
                    shadow-2xl shadow-black/40
                    p-8 space-y-6
                    animate-scale-in
                "
            >

                <h1 className="text-white text-xl font-semibold tracking-wide">
                    Rename File
                </h1>

                <div>
                    <input
                        type="text"
                        onChange={(e) => setNewFileName(e.target.value)}
                        value={newFileName}
                        placeholder="Enter new file name"
                        className="
                            w-full p-3 rounded-lg
                            bg-white/5 text-gray-200
                            border border-white/10 
                            placeholder-gray-500
                            focus:outline-none
                            focus:border-primary
                            focus:ring-0
                            transition
                            focus:shadow-[0_0_12px_rgba(79,139,255,0.35)]
                        "
                    />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                    <button
                        onClick={onClose}
                        className="
                            px-4 py-2 rounded-lg
                            bg-white/10 text-gray-200
                            hover:bg-white/20 
                            transition 
                        "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            renameFileHandler(fileId, newFileName);
                            onClose();
                        }}
                        className="
                            px-5 py-2 rounded-lg font-medium
                            bg-primary text-white
                            shadow-[0_0_14px_rgba(79,139,255,0.4)]
                            hover:bg-secondary 
                            transition 
                        "
                    >
                        Rename
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RenameFileModal;
