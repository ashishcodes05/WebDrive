import fileService from "../Services/fileService.js";

export const getFileById = async(req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const result = await fileService.getFileMetaDataAndPath(id, user._id);
    if(!result){
      return res.status(404).json({ success: false, message: "File Not Found" });
    }
    const { fileData, filePath } = result;
    const { action } = req.query;
    if (action && action === "download") {
      return res.download(filePath, fileData.name);
    }
    res.sendFile(filePath, (err) => {
      if (res.headersSent) return;
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal Server Error"
        });
      } else {
        res.status(200).end();
      }
    });
  } catch(err){
    next(err);
  }
}

export const uploadFiles = async (req, res, next) => {
  try {
    const user = req.user;
    const parDirId = req.params.parDirId || user.rootDirectory.toString();
    const uploadedFiles = req.files?.uploadedFiles;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }
    await fileService.processUploads(uploadedFiles, user._id, parDirId);
    return res.status(201).json({ success: true, message: "Files Uploaded Successfully" });
  } catch (err) {
    if(err.message === "PARENT_DIRECTORY_NOT_FOUND"){
      return res.status(404).json({ success: false, message: "Parent Directory Not Found" });
    }
    next(err);
  }
}

export const renameFileById = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newFilename } = req.body;
  if (!newFilename) {
    return res.status(400).json({
      success: false,
      message: "New filename is required"
    });
  }
  try {
    const fileData = await fileService.renameFile(id, user._id, newFilename);
    if(!fileData){
      return res.status(404).json({ success: false, message: "File not found" });
    }
    return res.status(200).json({ success: true, message: "Renamed Successfully" });
  } catch (err) {
    next(err);
  }
}

export const deleteFileById = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const fileData = await fileService.deleteFile(id, user._id);
    if(!fileData){
      return res.status(404).json({ success: false, message: "File not found" });
    }
    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    next(err);
  }
}