import User from "../Models/userModel.js";
import crypto from "node:crypto"

export default async function checkAuth(req, res, next) {
  const { token } = req.cookies;
  if(!token){
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access. Login to access",
    });
  }
  const [cookieData, extractedSignature] = token.split(".");
  const cookiePayload = Buffer.from(cookieData, "base64url").toString();
  const secret = "Webdrive-ashish@123#";
  const originalSignature = crypto.createHash("sha256").update(secret).update(cookiePayload).update(secret).digest("base64url");
  if(originalSignature !== extractedSignature){
    return res.status(401).json({
      success: false,
      message: "User not logged in"
    })
  }
  const {userId, expiry : expiryInSeconds} = JSON.parse(cookiePayload);
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
