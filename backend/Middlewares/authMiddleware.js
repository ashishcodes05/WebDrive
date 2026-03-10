import Session from "../Models/sessionModel.js";
import User from "../Models/userModel.js";
import redisClient from "../Configs/redis.js";

export const checkAuth = async(req, res, next) => {
  const sessionId = req.signedCookies.sid;
  if(!sessionId){
    res.clearCookie("sid");
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access. Login to access",
    });
  }

  const result = await redisClient.json.get(`session:${sessionId}`, {
    path: "$"
  })
  if(!result || result.length === 0){
    return res.status(401).json({success: false, message: "Not Authorised"});
  }
  const session = result[0];
  const user = await User.findOne({_id: session.userId, isDisabled: false});
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
  req.user = user;
  next();
}

export const checkShareAuth = async(req, res, next) => {
  const sessionId = req.signedCookies.sid;
  const redirectUrl = req.originalUrl;
  if(!sessionId){
    res.clearCookie("sid");
    return res.redirect(`http://localhost:5173/login?redirect=${redirectUrl}`);
  }

  const session = await redisClient.json.get(`session:${sessionId}`);
  if(!session){
    return res.redirect(`http://localhost:5173/login?redirect=${redirectUrl}`);
  }
  const user = await User.findOne({_id: session.userId, isDisabled: false});
  if (!user) {
    return res.redirect(`http://localhost:5173/login?redirect=${redirectUrl}`);
  }
  req.user = user;
  next();
}
