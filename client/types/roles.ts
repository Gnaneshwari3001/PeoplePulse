// Role and permission types
export type UserRole = 'super_admin' | 'admin' | 'hr_manager' | 'department_manager' | 'team_lead' | 'senior_employee' | 'employee' | 'intern';

export type Department = 'hr' | 'engineering' | 'marketing' | 'sales' | 'finance' | 'operations' | 'it' | 'admin' | 'legal';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  department: Department;
  permissions: Permission[];
  reportingManager?: string;
  employeeId: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending_verification';
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Permission {
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'approve' | 'manage')[];
}

// Role hierarchy and permissions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  admin: 90,
  hr_manager: 80,
  department_manager: 70,
  team_lead: 60,
  senior_employee: 50,
  employee: 40,
  intern: 30
};

export const DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    { module: 'all', actions: ['view', 'create', 'edit', 'delete', 'approve', 'manage'] }
  ],
  admin: [
    { module: 'users', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    { module: 'approval_workflow', actions: ['view', 'create', 'edit', 'delete', 'approve', 'manage'] },
    { module: 'policies', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    { module: 'reports', actions: ['view', 'create', 'edit', 'manage'] },
    { module: 'growth_feedback', actions: ['view', 'create', 'edit', 'manage'] }
  ],
  hr_manager: [
    { module: 'employees', actions: ['view', 'create', 'edit', 'manage'] },
    { module: 'approval_workflow', actions: ['view', 'create', 'edit', 'approve', 'manage'] },
    { module: 'hiring', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    { module: 'salary', actions: ['view', 'manage'] },
    { module: 'policies', actions: ['view', 'create', 'edit'] },
    { module: 'growth_feedback', actions: ['view', 'create', 'edit', 'manage'] }
  ],
  department_manager: [
    { module: 'team', actions: ['view', 'manage'] },
    { module: 'approval_workflow', actions: ['view', 'create', 'edit', 'approve'] },
    { module: 'tasks', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    { module: 'growth_feedback', actions: ['view', 'create', 'edit'] },
    { module: 'reports', actions: ['view', 'create'] }
  ],
  team_lead: [
    { module: 'team', actions: ['view', 'manage'] },
    { module: 'approval_workflow', actions: ['view', 'create', 'approve'] },
    { module: 'tasks', actions: ['view', 'create', 'edit', 'manage'] },
    { module: 'growth_feedback', actions: ['view', 'create', 'edit'] }
  ],
  senior_employee: [
    { module: 'tasks', actions: ['view', 'create', 'edit'] },
    { module: 'approval_workflow', actions: ['view', 'create'] },
    { module: 'growth_feedback', actions: ['view', 'create'] },
    { module: 'team', actions: ['view'] }
  ],
  employee: [
    { module: 'tasks', actions: ['view', 'create', 'edit'] },
    { module: 'approval_workflow', actions: ['view', 'create'] },
    { module: 'growth_feedback', actions: ['view', 'create'] },
    { module: 'team', actions: ['view'] },
    { module: 'salary', actions: ['view'] }
  ],
  intern: [
    { module: 'tasks', actions: ['view', 'create'] },
    { module: 'approval_workflow', actions: ['view', 'create'] },
    { module: 'team', actions: ['view'] }
  ]
};

// Department-specific configurations
export const DEPARTMENT_CONFIG: Record<Department, {
  name: string;
  color: string;
  modules: string[];
  manager_role: UserRole;
}> = {
  hr: {
    name: 'Human Resources',
    color: 'from-purple-500 to-purple-600',
    modules: ['employees', 'hiring', 'policies', 'growth_feedback', 'approval_workflow'],
    manager_role: 'hr_manager'
  },
  engineering: {
    name: 'Engineering',
    color: 'from-blue-500 to-blue-600',
    modules: ['tasks', 'team', 'approval_workflow', 'growth_feedback'],
    manager_role: 'department_manager'
  },
  marketing: {
    name: 'Marketing',
    color: 'from-pink-500 to-pink-600',
    modules: ['tasks', 'team', 'approval_workflow', 'growth_feedback'],
    manager_role: 'department_manager'
  },
  sales: {
    name: 'Sales',
    color: 'from-green-500 to-green-600',
    modules: ['tasks', 'team', 'approval_workflow', 'growth_feedback'],
    manager_role: 'department_manager'
  },
  finance: {
    name: 'Finance',
    color: 'from-emerald-500 to-emerald-600',
    modules: ['salary', 'approval_workflow', 'reports'],
    manager_role: 'department_manager'
  },
  operations: {
    name: 'Operations',
    color: 'from-orange-500 to-orange-600',
    modules: ['tasks', 'team', 'approval_workflow'],
    manager_role: 'department_manager'
  },
  it: {
    name: 'Information Technology',
    color: 'from-indigo-500 to-indigo-600',
    modules: ['tasks', 'team', 'approval_workflow', 'it_support'],
    manager_role: 'department_manager'
  },
  admin: {
    name: 'Administration',
    color: 'from-gray-500 to-gray-600',
    modules: ['approval_workflow', 'policies', 'documents'],
    manager_role: 'admin'
  },
  legal: {
    name: 'Legal',
    color: 'from-slate-500 to-slate-600',
    modules: ['policies', 'documents', 'approval_workflow'],
    manager_role: 'department_manager'
  }
};

// Utility functions
export const hasPermission = (userRole: UserRole, module: string, action: string): boolean => {
  const permissions = DEFAULT_PERMISSIONS[userRole];
  
  // Super admin has all permissions
  if (userRole === 'super_admin') return true;
  
  return permissions.some(permission => 
    (permission.module === 'all' || permission.module === module) &&
    permission.actions.includes(action as any)
  );
};

export const canAccessModule = (userRole: UserRole, module: string): boolean => {
  return hasPermission(userRole, module, 'view');
};

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    super_admin: 'Super Administrator',
    admin: 'Administrator',
    hr_manager: 'HR Manager',
    department_manager: 'Department Manager',
    team_lead: 'Team Lead',
    senior_employee: 'Senior Employee',
    employee: 'Employee',
    intern: 'Intern'
  };
  return roleNames[role];
};

export const getDepartmentDisplayName = (department: Department): string => {
  return DEPARTMENT_CONFIG[department]?.name || department;
};

export const getRoleColor = (role: UserRole): string => {
  const roleColors: Record<UserRole, string> = {
    super_admin: 'bg-red-100 text-red-800',
    admin: 'bg-purple-100 text-purple-800',
    hr_manager: 'bg-pink-100 text-pink-800',
    department_manager: 'bg-blue-100 text-blue-800',
    team_lead: 'bg-green-100 text-green-800',
    senior_employee: 'bg-yellow-100 text-yellow-800',
    employee: 'bg-gray-100 text-gray-800',
    intern: 'bg-orange-100 text-orange-800'
  };
  return roleColors[role];
};
