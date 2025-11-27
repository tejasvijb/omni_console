import { queryOptions } from "@tanstack/react-query";
import {
    fetchAllPermissions,
    fetchMyPermissions,
    fetchPermissionsByRole,
    resetPermissions,
    updatePermissions,
} from "../endpoints";
import { UpdatePermissionsBody, UserRole } from "../types";

export const permissionQueryOptions = {
    fetchMyPermissionsOptions: queryOptions({
        queryFn: fetchMyPermissions,
        queryKey: ["myPermissions"],
    }),
    fetchAllPermissionsOptions: queryOptions({
        queryFn: fetchAllPermissions,
        queryKey: ["allPermissions"],
    }),
    fetchPermissionsByRoleOptions: (role: UserRole) =>
        queryOptions({
            queryFn: () => fetchPermissionsByRole(role),
            queryKey: ["permissions", role],
        }),
    updatePermissionsMutation: {
        mutationFn: (body: UpdatePermissionsBody) => updatePermissions(body),
    },
    resetPermissionsMutation: {
        mutationFn: (role: UserRole) => resetPermissions(role),
    },
};
