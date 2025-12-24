import React from 'react'
import { useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';

const CreateFolderModal = ({ onClose }) => {
    const { dirId } = useParams();
    const BASE_URL = "http://localhost:4000";
    const [foldername, setFoldername] = useState("New Folder");
    const { fetchDirectoryContents } = useAppContext();
    const onCreate = async () => {
        try {
            const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ foldername })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Folder created successfully!");
                fetchDirectoryContents(dirId);
                onClose();
            } else {
                toast.error("Folder creation failed: " + data.message);
            }
        } catch (err) {
            console.error("Error creating folder:", err);
        }
    }
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div
                className="absolute inset-0 modal-backdrop bg-black/30 backdrop-blur-sm animate-fade-in"
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
                    Create Folder
                </h1>

                <div>
                    <input
                        type="text"
                        onChange={(e) => {
                            setFoldername(e.target.value);
                        }}
                        value={foldername}
                        placeholder="Enter new folder name"
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
                        onClick={onCreate}
                        className="
                            px-5 py-2 rounded-lg font-medium
                            bg-primary text-white
                            btn-glow
                            hover:bg-secondary 
                            transition 
                        "
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateFolderModal