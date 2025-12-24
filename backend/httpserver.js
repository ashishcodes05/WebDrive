import { createWriteStream } from "fs";
import { open, readdir, rename, rm } from "fs/promises";
import http from "http";
import mime from "mime-types";

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(2)} ${units[i]}`;
}

const serveDirectory = async (req, res, url) => {
  const itemsList = await readdir(`./Storage${url === "/" ? "" : url}`);
  const directoryItems = await Promise.all(
    itemsList.map(async (item) => {
      const fileHandle = await open(
        `./Storage${url === "/" ? "" : url}/${item}`
      );
      const stats = await fileHandle.stat();
      const size = formatFileSize(stats.size);
      let type = "Unknown";
      if (stats.isDirectory()) {
        type = "folder";
      } else {
        const mimeType = mime.lookup(
          `./Storage${url === "/" ? "" : url}/${item}`
        );
        type = mime.extension(mimeType);
      }
      return {
        name: item,
        size,
        type,
      };
    })
  );
  res.setHeader("Content-Type", "Application/JSON");
  res.end(JSON.stringify(directoryItems));
  // let dynamicHtml = "";
  // itemsList.forEach((item) => {
  //   dynamicHtml += `<li>${item}<a href=".${url == '/' ? "" : url}/${item}?action=open">Open</a> <a href=".${url == '/' ? "" : url}/${item}?action=download">Download</a></li>`;
  // });
  // res.end(`<!DOCTYPE html>
  //       <html lang="en">
  //       <head>
  //           <meta charset="UTF-8">
  //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //           <title>Document</title>
  //       </head>
  //       <body>
  //           <h1>My Files</h1>
  //           <ul>
  //               ${dynamicHtml}
  //           </ul>
  //       </body>
  //       </html>`);
};
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  try {
    if (req.url === "/favicon.ico") return;
    if (req.method === "GET") {
      if (req.url === "/") {
        serveDirectory(req, res, req.url);
      } else {
        const [url, queryString] = req.url.split("?");
        const queryParams = {};
        queryString?.split("&").forEach((query) => {
          const [key, value] = query.split("=");
          queryParams[key] = value;
        });
        const path = `./Storage${decodeURIComponent(url)}`;
        const fileHandle = await open(path);
        const stats = await fileHandle.stat();
        if (stats.isDirectory()) {
          serveDirectory(req, res, url);
        } else {
          res.setHeader("Content-Type", mime.lookup(url.slice(1)));
          res.setHeader("Content-Length", `${stats.size}`);
          if (queryParams.action && queryParams.action === "download") {
            res.setHeader(
              "Content-Disposition",
              `attachment; filename=${url.slice(1)}`
            );
          }
          const readStream = fileHandle.createReadStream();
          readStream.on("end", async () => {
            await fileHandle.close();
          });
          readStream.on("error", async (err) => {
            console.error("Stream error:", err);
            await fileHandle.close();
          });
          readStream.pipe(res);
        }
      }
    } else if (req.method === "OPTIONS") {
      res.statusCode = 200;
      res.end();
    } else if(req.method === "POST") {
      const path = req.url === "/" ? "" : req.url;
      const { filename } = req.headers;
      const filehandle = await open(`./Storage${path}/${filename}`, "w");
      const writeStream = filehandle.createWriteStream();
      req.pipe(writeStream);
      req.on("end", () => {
        res.end(
          JSON.stringify({
            success: true,
            message: "File uploaded successfully",
          })
        );
      });
      req.on("error", (err) => {
        console.log("Error while writing", err);
        res.end();
      });
    } else if(req.method === "DELETE"){
      try {
        req.on("data", async(chunk) => {
          const pathToDelete = chunk.toString();
          const fileHandle = await open(`./Storage${pathToDelete}`);
          const stats = await fileHandle.stat();
          if(stats.isDirectory()){
            await rm(`./Storage${pathToDelete}`, {recursive: true});
          } else {
            await rm(`./Storage${pathToDelete}`);
          }
          await fileHandle.close();
          res.end(JSON.stringify({success: true, message: "Deleted Successfully"}));
        })
      } catch(err){
        console.log("Error while deleting files/folders", err);
      }
    } else if(req.method === "PATCH"){
      try {
        req.on('data', async(chunk) => {
        const {oldPath, newPath} = JSON.parse(chunk.toString());
        await rename(`./Storage${oldPath}`, `./Storage${newPath}`);
        res.end(JSON.stringify({
          success: true,
          message: "Renamed successfully"
        }))
      })
      } catch (err) {
        console.log("Error while renaming file/folder", err);
      }
    }
  } catch (err) {
    res.statusCode = 404;
    console.log(err);
    res.end("The File you are looking for is changed or Deleted.");
  }
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server is running on port 4000");
});
