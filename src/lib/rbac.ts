export const checkRole = (userRole: string, allowedRoles: string[]) => {
  return allowedRoles.includes(userRole);
};
