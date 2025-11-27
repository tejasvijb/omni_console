import api from "../api";
import {
    PermissionAPIResponse,
    PermissionsAPIResponse,
    UpdatePermissionsBody,
    UserRole,
} from "../types";

const URLS = {
    permissions: "/permissions",
    myPermissions: "/permissions/me",
    permissionsByRole: (role: UserRole) => `/permissions/${role}`,
    resetPermissions: (role: UserRole) => `/permissions/reset/${role}`,
};

// Get current user's permissions
export const fetchMyPermissions = () => {
    return api.get<PermissionAPIResponse>(URLS.myPermissions);
};

// Get all permissions (admin only)
export const fetchAllPermissions = () => {
    return api.get<PermissionsAPIResponse>(URLS.permissions);
};

// Get permissions by role (admin only)
export const fetchPermissionsByRole = (role: UserRole) => {
    return api.get<PermissionAPIResponse>(URLS.permissionsByRole(role));
};

// Update permissions (admin only)
export const updatePermissions = (body: UpdatePermissionsBody) => {
    return api.put<PermissionAPIResponse>(URLS.permissions, body);
};

// Reset permissions to default (admin only)
export const resetPermissions = (role: UserRole) => {
    return api.post<PermissionAPIResponse>(URLS.resetPermissions(role), {});
};
