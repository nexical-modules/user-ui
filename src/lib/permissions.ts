// Permissions check for UI visibility
export const Permission = {
  check: (action: string, role: string) => {
    if (role === 'ADMIN' || role === 'SUDO') return true;
    const permissions: Record<string, string[]> = {
      ADMIN: ['user:list', 'user:create', 'user:update', 'user:delete', 'user:invite'],
      EMPLOYEE: ['user:read_self', 'user:update_self'],
      CONTRACTOR: ['user:read_self'],
    };
    return (permissions[role] || []).includes(action);
  },
};
