// User role types
export type UserRole = "admin" | "analyst" | "viewer";

// User type from backend (persisted user)
export type PersistedUser = {
    id: string;
    email: string;
    role: UserRole;
};

// Request body types
export type LoginRequestBody = {
    email: string;
    password: string;
};

export type RegisterRequestBody = {
    email: string;
    password: string;
    role?: UserRole;
};

export type UserWithoutConfirmPassword = Omit<
    RegisterRequestBody,
    "password"
> & {
    password: string;
};

// Response types
export type LoginInfoAPIResponse = {
    accessToken: string;
    user: PersistedUser;
};

export type CurrentUserAPIResponse = {
    user: PersistedUser;
};

export type RegisterInfoAPIResponse = {
    user: PersistedUser;
};

// Error response type
export type AuthErrorResponse = {
    message: string;
    title?: string;
};

// ============= PERMISSION TYPES =============

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

export interface PermissionsAPIResponse {
    permissions: RolePermissions[];
}

export interface PermissionAPIResponse {
    permission: RolePermissions;
}

// ============= SHORT URL TYPES =============
