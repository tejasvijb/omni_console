import type { UpdatePermissionsBody } from "#/types/permission.js";
import type { UserRole } from "#/types/user.js";
import type { Request, Response } from "express";

import { DEFAULT_PERMISSIONS } from "#/types/permission.js";
import asyncHandler from "express-async-handler";

import PermissionModel from "../models/permission.model.js";

// Initialize default permissions if they don't exist
export const initializeDefaultPermissions = async () => {
  const roles: UserRole[] = ["admin", "analyst", "viewer"];

  for (const role of roles) {
    const existingPermission = await PermissionModel.findOne({ role }).lean().exec();
    if (!existingPermission) {
      await PermissionModel.create({
        pages: DEFAULT_PERMISSIONS[role].pages,
        resources: DEFAULT_PERMISSIONS[role].resources,
        role,
      });
      console.log(`Default permissions created for role: ${role}`);
    }
  }
};

// Get all permissions (admin only)
export const getAllPermissions = asyncHandler(async (_req: Request, res: Response) => {
  const permissions = await PermissionModel.find().lean().exec();

  // If no permissions exist, initialize them
  if (permissions.length === 0) {
    await initializeDefaultPermissions();
    const newPermissions = await PermissionModel.find().lean().exec();
    res.status(200).json({ permissions: newPermissions });
    return;
  }

  res.status(200).json({ permissions });
});

// Get permissions for a specific role
export const getPermissionsByRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.params;

  if (!role || !["admin", "analyst", "viewer"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role specified");
  }

  let permission = await PermissionModel.findOne({ role }).lean().exec();

  // If no permission exists for this role, create default
  if (!permission) {
    const defaultPerms = DEFAULT_PERMISSIONS[role as UserRole];
    permission = await PermissionModel.create({
      pages: defaultPerms.pages,
      resources: defaultPerms.resources,
      role,
    });
  }

  res.status(200).json({ permission });
});

// Get current user's permissions
export const getCurrentUserPermissions = asyncHandler(async (req: Request, res: Response) => {
  const userRole = req.user?.role as undefined | UserRole;

  if (!userRole) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  let permission = await PermissionModel.findOne({ role: userRole }).lean().exec();

  // If no permission exists for this role, create default
  if (!permission) {
    const defaultPerms = DEFAULT_PERMISSIONS[userRole];
    permission = await PermissionModel.create({
      pages: defaultPerms.pages,
      resources: defaultPerms.resources,
      role: userRole,
    });
  }

  res.status(200).json({ permission });
});

// Update permissions for a role (admin only)
export const updatePermissions = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as UpdatePermissionsBody;
  const { pages, resources, role } = body;

  if (!role || !["admin", "analyst", "viewer"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role specified");
  }

  // Prevent modifying admin's access-control page access
  if (role === "admin" && pages) {
    const accessControlPage = pages.find((p) => p.pageId === "access-control");
    if (accessControlPage && !accessControlPage.canAccess) {
      res.status(400);
      throw new Error("Cannot remove admin access to Access Control page");
    }
  }

  const updateData: Partial<UpdatePermissionsBody> = {};
  if (pages) updateData.pages = pages;
  if (resources) updateData.resources = resources;

  const permission = await PermissionModel.findOneAndUpdate({ role }, { $set: updateData }, { new: true, runValidators: true, upsert: true })
    .lean()
    .exec();

  res.status(200).json({ permission });
});

// Reset permissions to default (admin only)
export const resetPermissionsToDefault = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.params;

  if (!role || !["admin", "analyst", "viewer"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role specified");
  }

  const defaultPerms = DEFAULT_PERMISSIONS[role as UserRole];

  const permission = await PermissionModel.findOneAndUpdate(
    { role },
    {
      $set: {
        pages: defaultPerms.pages,
        resources: defaultPerms.resources,
      },
    },
    { new: true, runValidators: true, upsert: true },
  )
    .lean()
    .exec();

  res.status(200).json({ permission });
});
