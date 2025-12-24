import { ObjectId } from "mongodb";

export default function validateIdMiddleware(req, res, next, id) {
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid id format"
    });
  }
  next();
}