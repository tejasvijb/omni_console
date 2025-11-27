export type UserRole = "admin" | "analyst" | "viewer";

export type ActionType = "create" | "delete" | "edit" | "view";

export type PageId = "access-control" | "dashboard" | "workflows";

export type ResourceId =
    | "barChart1"
    | "barChart2"
    | "lineChart"
    | "pieChart"
    | "workflowItems";

export interface PagePermission {
    canAccess: boolean;
    pageId: PageId;
}

export interface ResourcePermission {
    actions: ActionType[];
    resourceId: ResourceId;
}

export interface RolePermissions {
    _id?: string;
    createdAt?: string;
    pages: PagePermission[];
    resources: ResourcePermission[];
    role: UserRole;
    updatedAt?: string;
}

export interface UpdatePermissionsBody {
    pages?: PagePermission[];
    resources?: ResourcePermission[];
    role: UserRole;
}

// API Response types
export interface PermissionsAPIResponse {
    permissions: RolePermissions[];
}

export interface PermissionAPIResponse {
    permission: RolePermissions;
}

// Legacy chart permissions (kept for backward compatibility, will be replaced)
export interface ChartAccessConfig {
    role: UserRole;
    visible: boolean;
}

export interface ChartsPermissions {
    barChart1: UserRole[];
    barChart2: UserRole[];
    lineChart: UserRole[];
    pieChart: UserRole[];
}

export const CHARTS_PERMISSIONS: ChartsPermissions = {
    barChart1: ["admin", "analyst"],
    barChart2: ["admin"],
    lineChart: ["admin", "analyst", "viewer"],
    pieChart: ["admin", "analyst"],
};
