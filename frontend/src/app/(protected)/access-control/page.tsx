"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useAdminPermissions, usePermissions } from "@/app/hooks/usePermissions";
import {
  ActionType,
  PageId,
  ResourceId,
  RolePermissions,
  UserRole,
} from "@/api-config/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Save, ShieldAlert, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const ROLES: UserRole[] = ["admin", "analyst", "viewer"];

const PAGE_LABELS: Record<PageId, string> = {
  "access-control": "Access Control",
  dashboard: "Dashboard",
  workflows: "Workflows",
};

const RESOURCE_LABELS: Record<ResourceId, string> = {
  barChart1: "Bar Chart 1",
  barChart2: "Bar Chart 2",
  lineChart: "Line Chart",
  pieChart: "Pie Chart",
  workflowItems: "Workflow Items",
};

const ACTION_LABELS: Record<ActionType, string> = {
  create: "Create",
  delete: "Delete",
  edit: "Edit",
  view: "View",
};

const ACTIONS: ActionType[] = ["view", "create", "edit", "delete"];

// Default permissions fallback (matches backend defaults)
const DEFAULT_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    role: "admin",
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
    role: "analyst",
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
    role: "viewer",
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

export default function AccessControlPage() {
  const router = useRouter();
  const { currentUserData, isCurrentUserLoading } = useAuth();
  const { canAccessPage, isPermissionsLoading } = usePermissions(
    currentUserData?.data?.user?.role
  );
  const {
    allPermissions,
    isAllPermissionsLoading,
    updateRolePermissions,
    isUpdating,
    resetRolePermissions,
    isResetting,
  } = useAdminPermissions();

  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [localChanges, setLocalChanges] = useState<
    Record<UserRole, Partial<RolePermissions> | undefined>
  >({
    admin: undefined,
    analyst: undefined,
    viewer: undefined,
  });

  // Compute edited permissions from server data + local changes
  // Falls back to defaults if server data doesn't exist for a role
  const editedPermissions = useMemo(() => {
    const result: Record<UserRole, RolePermissions> = {
      admin: DEFAULT_PERMISSIONS.admin,
      analyst: DEFAULT_PERMISSIONS.analyst,
      viewer: DEFAULT_PERMISSIONS.viewer,
    };

    if (allPermissions) {
      allPermissions.forEach((serverPerm) => {
        const localChange = localChanges[serverPerm.role];
        if (localChange) {
          result[serverPerm.role] = {
            ...serverPerm,
            pages: localChange.pages ?? serverPerm.pages,
            resources: localChange.resources ?? serverPerm.resources,
          };
        } else {
          result[serverPerm.role] = { ...serverPerm };
        }
      });
    }

    // Apply local changes even if server data doesn't exist yet
    ROLES.forEach((role) => {
      const localChange = localChanges[role];
      if (localChange && !allPermissions?.find((p) => p.role === role)) {
        result[role] = {
          ...DEFAULT_PERMISSIONS[role],
          pages: localChange.pages ?? DEFAULT_PERMISSIONS[role].pages,
          resources: localChange.resources ?? DEFAULT_PERMISSIONS[role].resources,
        };
      }
    });

    return result;
  }, [allPermissions, localChanges]);

  const hasChanges = useMemo(() => ({
    admin: !!localChanges.admin,
    analyst: !!localChanges.analyst,
    viewer: !!localChanges.viewer,
  }), [localChanges]);

  // Check if user is admin and can access this page
  const shouldRedirect = !isCurrentUserLoading &&
    !isPermissionsLoading &&
    (currentUserData?.data?.user?.role !== "admin" || !canAccessPage("access-control"));

  if (shouldRedirect && typeof window !== "undefined") {
    router.push("/");
  }

  const handlePagePermissionChange = useCallback(
    (role: UserRole, pageId: PageId, canAccess: boolean) => {
      // Prevent admin from losing access to access-control page
      if (role === "admin" && pageId === "access-control" && !canAccess) {
        toast.error("Cannot remove admin access to Access Control page");
        return;
      }

      setLocalChanges((prev) => {
        const currentServerPerm = allPermissions?.find((p) => p.role === role);
        const basePerm = currentServerPerm ?? DEFAULT_PERMISSIONS[role];

        const currentPages = prev[role]?.pages ?? basePerm.pages;
        const updatedPages = currentPages.map((p) =>
          p.pageId === pageId ? { ...p, canAccess } : p
        );

        return {
          ...prev,
          [role]: {
            ...prev[role],
            pages: updatedPages,
            resources: prev[role]?.resources ?? basePerm.resources,
          },
        };
      });
    },
    [allPermissions]
  );

  const handleResourceActionChange = useCallback(
    (role: UserRole, resourceId: ResourceId, action: ActionType, enabled: boolean) => {
      setLocalChanges((prev) => {
        const currentServerPerm = allPermissions?.find((p) => p.role === role);
        const basePerm = currentServerPerm ?? DEFAULT_PERMISSIONS[role];

        const currentResources = prev[role]?.resources ?? basePerm.resources;
        const updatedResources = currentResources.map((r) => {
          if (r.resourceId !== resourceId) return r;

          const newActions = enabled
            ? [...r.actions, action]
            : r.actions.filter((a) => a !== action);

          // Sort actions to maintain consistency
          const sortedActions = newActions.sort() as ActionType[];

          return { ...r, actions: sortedActions };
        });

        return {
          ...prev,
          [role]: {
            ...prev[role],
            pages: prev[role]?.pages ?? basePerm.pages,
            resources: updatedResources,
          },
        };
      });
    },
    [allPermissions]
  );

  const handleSave = useCallback(
    (role: UserRole) => {
      const perms = editedPermissions[role];
      if (!perms) return;

      updateRolePermissions({
        role,
        pages: perms.pages,
        resources: perms.resources,
      });
      setLocalChanges((prev) => ({ ...prev, [role]: undefined }));
      toast.success(`Permissions updated for ${role}`);
    },
    [editedPermissions, updateRolePermissions]
  );

  const handleReset = useCallback(
    (role: UserRole) => {
      resetRolePermissions(role);
      setLocalChanges((prev) => ({ ...prev, [role]: undefined }));
      toast.success(`Permissions reset to default for ${role}`);
    },
    [resetRolePermissions]
  );

  // Loading states
  if (isCurrentUserLoading || isPermissionsLoading || isAllPermissionsLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Access denied
  if (currentUserData?.data?.user?.role !== "admin") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Access Control</h1>
          <p className="text-muted-foreground mt-1">
            Manage role-based permissions for pages and resources
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 dark:bg-green-900/30">
          <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Admin Access
          </span>
        </div>
      </div>

      <Tabs
        defaultValue="admin"
        value={selectedRole}
        onValueChange={(v) => setSelectedRole(v as UserRole)}
      >
        <TabsList className="grid w-full grid-cols-3">
          {ROLES.map((role) => (
            <TabsTrigger key={role} value={role} className="capitalize">
              {role}
              {hasChanges[role] && (
                <span className="ml-2 h-2 w-2 rounded-full bg-amber-500" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {ROLES.map((role) => (
          <TabsContent key={role} value={role} className="space-y-6">
            {/* Page Access */}
            <Card>
              <CardHeader>
                <CardTitle>Page Access</CardTitle>
                <CardDescription>
                  Control which pages this role can view in the sidebar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="w-32 text-center">Can Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editedPermissions[role].pages.map((page) => (
                      <TableRow key={page.pageId}>
                        <TableCell className="font-medium">
                          {PAGE_LABELS[page.pageId]}
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={page.canAccess}
                            onCheckedChange={(checked) =>
                              handlePagePermissionChange(
                                role,
                                page.pageId,
                                checked as boolean
                              )
                            }
                            disabled={
                              role === "admin" && page.pageId === "access-control"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Resource Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Permissions</CardTitle>
                <CardDescription>
                  Control what actions this role can perform on specific resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      {ACTIONS.map((action) => (
                        <TableHead key={action} className="w-24 text-center capitalize">
                          {ACTION_LABELS[action]}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editedPermissions[role].resources.map((resource) => (
                      <TableRow key={resource.resourceId}>
                        <TableCell className="font-medium">
                          {RESOURCE_LABELS[resource.resourceId]}
                        </TableCell>
                        {ACTIONS.map((action) => (
                          <TableCell key={action} className="text-center">
                            <Checkbox
                              checked={resource.actions.includes(action)}
                              onCheckedChange={(checked) =>
                                handleResourceActionChange(
                                  role,
                                  resource.resourceId,
                                  action,
                                  checked as boolean
                                )
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => handleReset(role)}
                disabled={isResetting}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Default
              </Button>
              <Button
                onClick={() => handleSave(role)}
                disabled={!hasChanges[role] || isUpdating}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}