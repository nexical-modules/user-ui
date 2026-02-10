'use client';

import React from 'react';
import { AdminUserManagement } from '../../components/admin/admin-user-management';
import { useNavData } from '@/lib/ui/nav-context';

/**
 * Registry component for Admin User Management.
 * Renders in the details panel.
 */
export default function UserManagementRegistry() {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { context } = useNavData();

  return (
    <div className="user-management-registry-container pb-10">
      <AdminUserManagement />
    </div>
  );
}
