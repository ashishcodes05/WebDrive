import Session from "../Models/sessionModel.js";
import User from "../Models/userModel.js";

export default async function checkAuth(req, res, next) {
  const sessionId = req.signedCookies.sid;
  if(!sessionId){
    res.clearCookie("sid");
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access. Login to access",
    });
  }

  const session = await Session.findById(sessionId);
  const user = await User.findOne({_id: session.userId});
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
  req.user = user;
  next();
}
