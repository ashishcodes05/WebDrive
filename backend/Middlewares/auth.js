import User from "../Models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { token } = req.cookies;
  const {userId, expiry : expiryInSeconds} = JSON.parse(Buffer.from(token, "base64url").toString());
  const user = await User.findOne({_id: userId});
  if (!userId || !user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
  const currentTimeInSeconds = Math.round(Date.now()/1000);
  if(currentTimeInSeconds > expiryInSeconds){
    res.clearCookie("token");
    return res.status(401).json({success: false, message: "User logged out"});
  }
  req.user = user;
  next();
}
