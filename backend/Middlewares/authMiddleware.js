import Session from "../Models/sessionModel.js";
import User from "../Models/userModel.js";

export const checkAuth = async(req, res, next) => {
  const sessionId = req.signedCookies.sid;
  if(!sessionId){
    res.clearCookie("sid");
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access. Login to access",
    });
  }

  const session = await Session.findById(sessionId);
  if(!session){
    return res.status(401).json({success: false, message: "Not Authorised"});
  }
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

  const session = await Session.findById(sessionId);
  if(!session){
    return res.redirect(`http://localhost:5173/login?redirect=${redirectUrl}`);
  }
  const user = await User.findOne({_id: session.userId, isDisabled: false});
  console.log(user.name)
  if (!user) {
    return res.redirect(`http://localhost:5173/login?redirect=${redirectUrl}`);
  }
  req.user = user;
  next();
}
