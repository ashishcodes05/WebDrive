import { ROLES } from "./roles.js";

export const getPermissionsForRole = (role) => {
  return ROLES[role] || [];
};

export const hasPermission = (role, permission) => {
  return getPermissionsForRole(role).includes(permission);
};
