import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/roles";

interface RoleAccessProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: Array<{
    module: string;
    action: string;
  }>;
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL permissions/roles
}

export function RoleAccess({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  fallback = null,
  requireAll = false 
}: RoleAccessProps) {
  const { userProfile, hasPermission } = useAuth();

  if (!userProfile) {
    return <>{fallback}</>;
  }

  // Check role requirements
  const hasRequiredRole = requiredRoles.length === 0 || 
    (requireAll 
      ? requiredRoles.every(role => userProfile.role === role)
      : requiredRoles.includes(userProfile.role)
    );

  // Check permission requirements
  const hasRequiredPermissions = requiredPermissions.length === 0 ||
    (requireAll
      ? requiredPermissions.every(perm => hasPermission(perm.module, perm.action))
      : requiredPermissions.some(perm => hasPermission(perm.module, perm.action))
    );

  // Grant access if both role and permission checks pass
  const hasAccess = hasRequiredRole && hasRequiredPermissions;

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Convenience components for common access patterns
export function ManagerOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleAccess 
      requiredRoles={['department_manager', 'team_lead', 'hr_manager', 'admin', 'super_admin']}
      fallback={fallback}
    >
      {children}
    </RoleAccess>
  );
}

export function HROnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleAccess 
      requiredRoles={['hr_manager', 'admin', 'super_admin']}
      fallback={fallback}
    >
      {children}
    </RoleAccess>
  );
}

export function AdminOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleAccess 
      requiredRoles={['admin', 'super_admin']}
      fallback={fallback}
    >
      {children}
    </RoleAccess>
  );
}

export function EmployeeOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleAccess 
      requiredRoles={['employee', 'senior_employee', 'intern']}
      fallback={fallback}
    >
      {children}
    </RoleAccess>
  );
}

export function WithPermission({ 
  children, 
  module, 
  action, 
  fallback = null 
}: { 
  children: ReactNode; 
  module: string; 
  action: string; 
  fallback?: ReactNode 
}) {
  return (
    <RoleAccess 
      requiredPermissions={[{ module, action }]}
      fallback={fallback}
    >
      {children}
    </RoleAccess>
  );
}
