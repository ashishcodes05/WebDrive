import directoryService from "../Services/directoryService.js";

export const getDirectoryById = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id || user.rootDirectory.toString();
    const { files, directories } = await directoryService.getDirectoryContents(id, user._id);
    return res.status(200).json({
      success: true,
      message: "Directory Found!",
      directoryData: {
        files,
        directories
      }
    });
  } catch (err) {
    next(err);
  }
}

export const createDirectory = async (req, res, next) => {
  try {
    const user = req.user;
    const { foldername } = req.body;
    const parDirId = req.params.parDirId || user.rootDirectory.toString();
    await directoryService.createDirectory(foldername, parDirId, user._id);
    return res.status(200).json({ success: true, message: "Folder Created Successfully" });
  } catch (err) {
    next(err);
  }
}

export const renameDirectory = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { newDirectoryName } = req.body;
    if (!newDirectoryName || newDirectoryName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "New directory name is required"
      });
    }
    await directoryService.renameDirectory(id, user._id, newDirectoryName);
    return res.json({
      success: true,
      message: "Directory renamed successfully"
    });
  } catch (err) {
    next(err);
  }
}

export const deleteDirectoryById = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  try {
    await directoryService.deleteDirectory(id, user._id);
    return res.status(200).json({ success: true, message: "Directory Deleted Successfully" });
  } catch (err) {
    next(err);
  }
}