import { 
  File, 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileArchive, 
  FileCode,
  Folder
} from "lucide-react";

export const fileTypeIcons = {
  pdf: { icon: FileText, color: "text-red-400" },
  doc: { icon: FileText, color: "text-blue-400" },
  docx: { icon: FileText, color: "text-blue-400" },
  txt: { icon: FileText, color: "text-gray-300" },

  jpg: { icon: FileImage, color: "text-yellow-300" },
  jpeg: { icon: FileImage, color: "text-yellow-300" },
  png: { icon: FileImage, color: "text-yellow-300" },
  gif: { icon: FileImage, color: "text-purple-300" },

  mp4: { icon: FileVideo, color: "text-purple-400" },
  mov: { icon: FileVideo, color: "text-purple-400" },

  mp3: { icon: FileAudio, color: "text-green-400" },
  wav: { icon: FileAudio, color: "text-green-400" },

  zip: { icon: FileArchive, color: "text-orange-400" },
  rar: { icon: FileArchive, color: "text-orange-400" },

  js: { icon: FileCode, color: "text-yellow-400" },
  ts: { icon: FileCode, color: "text-blue-400" },
  json: { icon: FileCode, color: "text-green-400" },
  folder: { icon: Folder, color: "text-yellow-400" },
  default: { icon: File, color: "text-gray-300" },
};
