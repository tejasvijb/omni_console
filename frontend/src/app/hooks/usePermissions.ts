"use client";

import { permissionQueryOptions } from "@/api-config/queryOptions/permissionQueries";
import {
    ActionType,
    PageId,
    ResourceId,
    RolePermissions,
    UpdatePermissionsBody,
    UserRole,
} from "@/api-config/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export const usePermissions = (userRole?: UserRole) => {
    const queryClient = useQueryClient();

    // Fetch current user's permissions
    const {
        data: permissionsData,
        isLoading: isPermissionsLoading,
        error: permissionsError,
    } = useQuery({
        ...permissionQueryOptions.fetchMyPermissionsOptions,
        enabled: !!userRole,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const permissions = permissionsData?.data?.permission;

    // Check if user can access a specific page
    const canAccessPage = useCallback(
        (pageId: PageId): boolean => {
            if (!permissions) return false;
            const page = permissions.pages.find((p) => p.pageId === pageId);
            return page?.canAccess ?? false;
        },
        [permissions]
    );

    // Check if user has a specific action on a resource
    const hasResourceAction = useCallback(
        (resourceId: ResourceId, action: ActionType): boolean => {
            if (!permissions) return false;
            const resource = permissions.resources.find(
                (r) => r.resourceId === resourceId
            );
            return resource?.actions.includes(action) ?? false;
        },
        [permissions]
    );

    // Check if user can view a resource
    const canView = useCallback(
        (resourceId: ResourceId): boolean => {
            return hasResourceAction(resourceId, "view");
        },
        [hasResourceAction]
    );

    // Check if user can create a resource
    const canCreate = useCallback(
        (resourceId: ResourceId): boolean => {
            return hasResourceAction(resourceId, "create");
        },
        [hasResourceAction]
    );

    // Check if user can edit a resource
    const canEdit = useCallback(
        (resourceId: ResourceId): boolean => {
            return hasResourceAction(resourceId, "edit");
        },
        [hasResourceAction]
    );

    // Check if user can delete a resource
    const canDelete = useCallback(
        (resourceId: ResourceId): boolean => {
            return hasResourceAction(resourceId, "delete");
        },
        [hasResourceAction]
    );

    // Get all accessible pages
    const accessiblePages = useMemo(() => {
        if (!permissions) return [];
        return permissions.pages
            .filter((p) => p.canAccess)
            .map((p) => p.pageId);
    }, [permissions]);

    // Invalidate permissions cache
    const invalidatePermissions = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["myPermissions"] });
        queryClient.invalidateQueries({ queryKey: ["allPermissions"] });
        queryClient.invalidateQueries({ queryKey: ["permissions"] });
    }, [queryClient]);

    return {
        permissions,
        isPermissionsLoading,
        permissionsError,
        canAccessPage,
        hasResourceAction,
        canView,
        canCreate,
        canEdit,
        canDelete,
        accessiblePages,
        invalidatePermissions,
    };
};

// Admin-only hook for managing all permissions
export const useAdminPermissions = () => {
    const queryClient = useQueryClient();

    // Fetch all permissions
    const {
        data: allPermissionsData,
        isLoading: isAllPermissionsLoading,
        error: allPermissionsError,
        refetch: refetchAllPermissions,
    } = useQuery({
        ...permissionQueryOptions.fetchAllPermissionsOptions,
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    const allPermissions = allPermissionsData?.data?.permissions;

    // Update permissions mutation
    const {
        mutate: updatePermissions,
        isPending: isUpdating,
        error: updateError,
    } = useMutation({
        ...permissionQueryOptions.updatePermissionsMutation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allPermissions"] });
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
            queryClient.invalidateQueries({ queryKey: ["myPermissions"] });
        },
    });

    // Reset permissions mutation
    const {
        mutate: resetPermissions,
        isPending: isResetting,
        error: resetError,
    } = useMutation({
        ...permissionQueryOptions.resetPermissionsMutation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allPermissions"] });
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
            queryClient.invalidateQueries({ queryKey: ["myPermissions"] });
        },
    });

    // Helper to get permissions for a specific role
    const getPermissionsByRole = useCallback(
        (role: UserRole): RolePermissions | undefined => {
            return allPermissions?.find((p) => p.role === role);
        },
        [allPermissions]
    );

    // Helper to update a specific role's permissions
    const updateRolePermissions = useCallback(
        (body: UpdatePermissionsBody) => {
            updatePermissions(body);
        },
        [updatePermissions]
    );

    // Helper to reset a specific role's permissions
    const resetRolePermissions = useCallback(
        (role: UserRole) => {
            resetPermissions(role);
        },
        [resetPermissions]
    );

    return {
        allPermissions,
        isAllPermissionsLoading,
        allPermissionsError,
        refetchAllPermissions,
        getPermissionsByRole,
        updateRolePermissions,
        isUpdating,
        updateError,
        resetRolePermissions,
        isResetting,
        resetError,
    };
};
