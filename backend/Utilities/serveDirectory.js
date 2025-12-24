import formatFileSize from "./formatFileSize.js";
import { open, readdir } from "fs/promises";
import mime from 'mime-types'

const serveDirectory = async (dirname) => {
  const fullPath = `./Storage${dirname || ""}`;
  const itemsList = await readdir(fullPath);
  const directoryItems = await Promise.all(
    itemsList.map(async (item) => {
      const fileHandle = await open(
        `${fullPath}/${item}`
      );
      const stats = await fileHandle.stat();
      const size = formatFileSize(stats.size);
      let type = "Unknown";
      if (stats.isDirectory()) {
        type = "folder";
      } else {
        const mimeType = mime.lookup(
          `./Storage/${item}`
        );
        type = mime.extension(mimeType);
      }
      await fileHandle.close();
      return {
        name: item,
        size,
        type,
        isDirectory: stats.isDirectory()
      };
    })
  );
  return directoryItems;
};

export default serveDirectory;