export const PERMISSIONS = {
  ADMIN_RESOURCE_OPERATIONS: "admin:ops",

  AUTH_LOGIN: "auth:login",
  AUTH_LOGOUT_SELF: "auth:logout:self",
  AUTH_LOGOUT_ALL_SELF: "auth:logout-all:self",
  AUTH_LOGOUT_ANY: "auth:logout:any",

  USER_READ_SELF: "user:read:self",
  USER_UPDATE_SELF: "user:update:self",
  USER_DELETE_SELF: "user:delete:self",

  USER_VIEW: "user:view",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",

  USER_TOGGLE_STATUS: "user:toggle-status",
  USER_CHANGE_ROLE: "user:change-role",
  USER_DELETE: "user:delete",

  FILE_CREATE_SELF: "file:create:self",
  FILE_READ_SELF: "file:read:self",
  FILE_UPDATE_SELF: "file:update:self",
  FILE_DELETE_SELF: "file:delete:self",
  FILE_SHARE_SELF: "file:share:self",

  FILE_VIEW_ANY: "file:view:any",
  FILE_UPDATE_ANY: "file:update:any",
  FILE_DELETE_ANY: "file:delete:any",

  FOLDER_CREATE_SELF: "folder:create:self",
  FOLDER_READ_SELF: "folder:read:self",
  FOLDER_UPDATE_SELF: "folder:update:self",
  FOLDER_DELETE_SELF: "folder:delete:self",

  FOLDER_VIEW_ANY: "folder:view:any",
  FOLDER_UPDATE_ANY: "folder:update:any",
  FOLDER_DELETE_ANY: "folder:delete:any",

  SYSTEM_VIEW_DASHBOARD: "system:view:dashboard",
  SYSTEM_VIEW_LOGS: "system:view:logs",
};
