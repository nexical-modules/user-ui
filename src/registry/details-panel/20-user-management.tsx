'use client';

import React from 'react';
import { AdminUserManagement } from '../../components/admin/admin-user-management';
import { useNavData } from '@/lib/ui/nav-context';
import { UserModuleTypes } from '@/lib/api';

/**
 * Registry component for Admin User Management.
 * Renders in the details panel.
 */
export default function UserManagementRegistry() {
  const { context } = useNavData();
  const currentUser = context?.user as UserModuleTypes.User | null;

  return (
    <div className="user-management-registry-container pb-10">
      <AdminUserManagement />
    </div>
  );
}
