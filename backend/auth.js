import usersData from "./usersDB.json" with {type: "json"};

export default function checkAuth(req, res, next) {
  const { userId } = req.cookies;
  const user = usersData.find((user) => user.id === userId);
  if (!userId || !user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
  req.user = user;
  next();
}
