import type { UserRole } from "./user.js";

export type ActionType = "create" | "delete" | "edit" | "view";

export type PageId = "access-control" | "dashboard" | "workflows";

export interface PagePermission {
  canAccess: boolean;
  pageId: PageId;
}

export interface PermissionDocument {
  _id?: string;
  createdAt?: Date;
  pages: PagePermission[];
  resources: ResourcePermission[];
  role: UserRole;
  updatedAt?: Date;
}

export type ResourceId = "barChart1" | "barChart2" | "lineChart" | "pieChart" | "workflowItems";

export interface ResourcePermission {
  actions: ActionType[];
  resourceId: ResourceId;
}

export interface RolePermissions {
  pages: PagePermission[];
  resources: ResourcePermission[];
  role: UserRole;
}

export interface UpdatePermissionsBody {
  pages?: PagePermission[];
  resources?: ResourcePermission[];
  role: UserRole;
}

// Default permissions configuration
export const DEFAULT_PERMISSIONS: Record<UserRole, Omit<RolePermissions, "role">> = {
  admin: {
    pages: [
      { canAccess: true, pageId: "dashboard" },
      { canAccess: true, pageId: "workflows" },
      { canAccess: true, pageId: "access-control" },
    ],
    resources: [
      { actions: ["create", "delete", "edit", "view"], resourceId: "barChart1" },
      { actions: ["create", "delete", "edit", "view"], resourceId: "barChart2" },
      { actions: ["create", "delete", "edit", "view"], resourceId: "lineChart" },
      { actions: ["create", "delete", "edit", "view"], resourceId: "pieChart" },
      { actions: ["create", "delete", "edit", "view"], resourceId: "workflowItems" },
    ],
  },
  analyst: {
    pages: [
      { canAccess: true, pageId: "dashboard" },
      { canAccess: false, pageId: "workflows" },
      { canAccess: false, pageId: "access-control" },
    ],
    resources: [
      { actions: ["view"], resourceId: "barChart1" },
      { actions: ["view"], resourceId: "barChart2" },
      { actions: ["view"], resourceId: "lineChart" },
      { actions: ["view"], resourceId: "pieChart" },
      { actions: [], resourceId: "workflowItems" },
    ],
  },
  viewer: {
    pages: [
      { canAccess: true, pageId: "dashboard" },
      { canAccess: true, pageId: "workflows" },
      { canAccess: false, pageId: "access-control" },
    ],
    resources: [
      { actions: ["view"], resourceId: "barChart1" },
      { actions: [], resourceId: "barChart2" },
      { actions: ["view"], resourceId: "lineChart" },
      { actions: [], resourceId: "pieChart" },
      { actions: ["view"], resourceId: "workflowItems" },
    ],
  },
};
