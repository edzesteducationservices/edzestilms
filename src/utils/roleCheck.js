// utils/roleCheck.js
export const isAdminRole = (role) => {
  return ["Admin", "SuperAdmin", "Teacher"].includes(role);
};
