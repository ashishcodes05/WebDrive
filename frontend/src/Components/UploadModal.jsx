import React, { useMemo, useRef, useState } from "react";
import { formatFileSize } from "../Utilities/SizeConverter";
import { FileIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../Context/AppContext";
import { useParams } from "react-router";

const UploadProgressIndicator = ({ progress, totalSize }) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-300">
            <span>Uploading files</span>
            <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
            />
        </div>
        <p className="text-[11px] text-gray-400 text-right">
            Total size: {formatFileSize(totalSize)}
        </p>
    </div>
);

const UploadModal = ({ onClose }) => {
    const { dirId } = useParams();
    const BASE_URL = "http://localhost:4000";
    const fileInputRef = useRef(null);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { fetchDirectoryContents } = useAppContext();

    const totalSelectedBytes = useMemo(
        () => selectedFiles.reduce((acc, file) => acc + file.size, 0),
        [selectedFiles]
    );

    function openFilePicker() {
        if (!isUploading) fileInputRef.current?.click();
    }

    function preventDefaults(e) {
        e.preventDefault();
    }

    function addFiles(files) {
        const updated = [...selectedFiles, ...files];
        if (updated.length > 10) {
            toast.error("You can upload a maximum of 10 files at a time.");
            return;
        }
        setSelectedFiles(updated);
    }

    function handleFiles(e) {
        const files = Array.from(e.target.files);
        if (files.length) addFiles(files);
    }

    function handleDrop(e) {
        e.preventDefault();
        if (isUploading) return;
        const files = Array.from(e.dataTransfer.files);
        if (files.length) addFiles(files);
    }

    const onUpload = async (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append("uploadedFiles", file));

        setIsUploading(true);
        setUploadProgress(0);

        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${BASE_URL}/file/${dirId || ""}`);
            xhr.withCredentials = true;
            xhr.upload.onprogress = (event) => {
                if (!event.lengthComputable) return;
                setUploadProgress(
                    Math.min(100, Math.round((event.loaded / event.total) * 100))
                );
            };

            xhr.onload = () => {
                setIsUploading(false);

                let responseData = null;
                try {
                    responseData = JSON.parse(xhr.responseText);
                } catch { }

                if (xhr.status >= 200 && xhr.status < 300 && responseData?.success) {
                    setUploadProgress(100);
                    setSelectedFiles([]);
                    fetchDirectoryContents(dirId);
                    toast.success("Files uploaded successfully!");
                    resolve(true);
                } else {
                    toast.error(responseData?.message || "File upload failed.");
                    resolve(false);
                }
            };

            xhr.onerror = () => {
                setIsUploading(false);
                toast.error("Unable to upload files. Please try again.");
                resolve(false);
            };

            xhr.send(formData);
        });
    };

    const handleUploadClick = async () => {
        if (!selectedFiles.length) {
            toast.error("Please select at least one file to upload.");
            return;
        }
        const success = await onUpload(selectedFiles);
        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={() => {
                    if (!isUploading) onClose();
                }}
            />

            <div
                className="
                    relative z-50 max-w-lg w-full p-8
                    bg-[#0f1629]/95 rounded-2xl
                    border border-white/10
                    shadow-2xl shadow-black/40
                    animate-scale-in
                    space-y-6
                "
            >
                <h2 className="text-xl text-white font-semibold tracking-wide">
                    Upload Files
                </h2>

                <div
                    onDrop={handleDrop}
                    onDragOver={preventDefaults}
                    onDragEnter={preventDefaults}
                    onDragLeave={preventDefaults}
                    className="
                        flex flex-col items-center justify-center 
                        border border-dashed border-white/20 
                        rounded-xl p-10
                        bg-white/5
                        hover:bg-white/10
                        transition
                        cursor-pointer
                    "
                    onClick={openFilePicker}
                >
                    <div className="text-gray-300 text-sm mb-2">
                        Drag & Drop your files here
                    </div>
                    <div className="text-gray-400 text-xs">
                        or click to browse
                    </div>
                </div>

                <input
                    name="uploadedFiles"
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFiles}
                    className="hidden"
                    disabled={isUploading}
                />

                {selectedFiles.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 max-h-56 overflow-y-auto scrollbar-none">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="
                                    flex items-center justify-between 
                                    p-3 bg-white/5 rounded-lg 
                                    border border-white/10 
                                    hover:bg-white/10 transition
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <FileIcon className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <p className="text-white text-sm truncate max-w-[260px]">
                                            {file.name}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (isUploading) return;
                                        setSelectedFiles(prev =>
                                            prev.filter((_, i) => i !== index)
                                        );
                                    }}
                                >
                                    <X className="w-5 h-5 text-red-400 hover:text-red-500 hover:scale-110 cursor-pointer transition-transform" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {isUploading && (
                    <UploadProgressIndicator
                        progress={uploadProgress}
                        totalSize={totalSelectedBytes}
                    />
                )}

                <div className="flex justify-end gap-4 pt-2">
                    <button
                        onClick={() => {
                            if (isUploading) return;
                            setSelectedFiles([]);
                            onClose();
                        }}
                        className="
                            px-4 py-2 rounded-lg
                            bg-white/10 text-gray-300
                            hover:bg-white/20 transition
                        "
                        disabled={isUploading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleUploadClick}
                        className="
                            px-5 py-2 rounded-lg
                            bg-primary text-white 
                            hover:bg-secondary 
                            shadow-[0_0_14px_rgba(79,139,255,0.4)]
                            transition
                        "
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
