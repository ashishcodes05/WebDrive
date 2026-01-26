import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  Folder,
} from "lucide-react";

export const fileTypeIcons = {
  pdf:   { icon: FileText, color: "text-red-400" },
  doc:   { icon: FileText, color: "text-blue-400" },
  docx:  { icon: FileText, color: "text-blue-400" },
  txt:   { icon: FileText, color: "text-slate-300" },

  jpg:   { icon: FileImage, color: "text-amber-400" },
  jpeg:  { icon: FileImage, color: "text-amber-400" },
  png:   { icon: FileImage, color: "text-amber-400" },
  gif:   { icon: FileImage, color: "text-fuchsia-400" },

  mp4:   { icon: FileVideo, color: "text-violet-400" },
  mov:   { icon: FileVideo, color: "text-violet-400" },

  mp3:   { icon: FileAudio, color: "text-emerald-400" },
  wav:   { icon: FileAudio, color: "text-emerald-400" },

  zip:   { icon: FileArchive, color: "text-orange-400" },
  rar:   { icon: FileArchive, color: "text-orange-400" },

  js:    { icon: FileCode, color: "text-yellow-300" },
  ts:    { icon: FileCode, color: "text-cyan-400" },
  json:  { icon: FileCode, color: "text-green-400" },

  folder:{ icon: Folder, color: "text-yellow-400 fill-current" },

  default:{ icon: File, color: "text-gray-400" },
};