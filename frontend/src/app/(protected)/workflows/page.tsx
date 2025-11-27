"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { usePermissions } from "@/app/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2, Eye } from "lucide-react";

const workflows = [
  { id: 1, name: "User Onboarding" },
  { id: 2, name: "Email Verification" },
  { id: 3, name: "Payment Processing" },
  { id: 4, name: "Data Backup" },
  { id: 5, name: "Report Generation" },
];

export default function WorkflowsPage() {
  const { currentUserData, isCurrentUserLoading } = useAuth();
  const { canView, canCreate, canEdit, canDelete, isPermissionsLoading } = usePermissions(
    currentUserData?.data?.user?.role
  );

  const handleCreate = () => {
    console.log("Create workflow");
  };

  const handleEdit = (id: number) => {
    console.log("Edit workflow:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete workflow:", id);
  };

  const handleView = (id: number) => {
    console.log("View workflow:", id);
  };

  if (isCurrentUserLoading || isPermissionsLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Check if user can view workflow items
  if (!canView("workflowItems")) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground mt-2">
            You do not have permission to view workflows.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workflows</h1>
        {canCreate("workflowItems") && (
          <Button onClick={handleCreate}>Create</Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workflow Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.map((workflow) => (
            <TableRow key={workflow.id}>
              <TableCell className="font-medium">{workflow.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {canView("workflowItems") && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleView(workflow.id)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {canEdit("workflowItems") && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleEdit(workflow.id)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {canDelete("workflowItems") && (
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => handleDelete(workflow.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}