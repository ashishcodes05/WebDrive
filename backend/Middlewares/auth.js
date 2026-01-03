import User from "../Models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { userId } = req.cookies;
  const user = await User.findOne({_id: userId});
  if (!userId || !user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
  req.user = user;
  next();
}
