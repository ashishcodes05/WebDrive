import { fileTypeIcons } from "./fileTypes.js";

export function getFileIcon(extension) {
  const ext = extension?.toLowerCase().replace(/^\./, "");
  return fileTypeIcons[ext] || fileTypeIcons.default;
}
