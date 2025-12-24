import { Db, ObjectId } from "mongodb";
import usersData from "./usersDB.json" with {type: "json"};

export default async function checkAuth(req, res, next) {
  const db = req.db;
  const { userId } = req.cookies;
  const user = await db.collection("users").findOne({_id: new ObjectId(userId)});
  if (!userId || !user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
  req.user = user;
  next();
}
