import { hasPermission } from "../Auth/rbac.js";

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({success: false, message: "Forbidden: You do not have the required permission."});
    }
    next();
  };
};

export const requireAllPermissions = (permissions = []) => {
  return (req, res, next) => {
    const role = req.user.role;

    const allowed = permissions.every(permission =>
      hasPermission(role, permission)
    );

    if (!allowed) {
      return res.status(403).json({success: false, message: "Forbidden: You do not have the required permission."});
    }

    next();
  };
};
