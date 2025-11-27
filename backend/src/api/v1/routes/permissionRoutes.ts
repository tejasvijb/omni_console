import express from "express";

import {
  getAllPermissions,
  getCurrentUserPermissions,
  getPermissionsByRole,
  resetPermissionsToDefault,
  updatePermissions,
} from "../controllers/permissionController.js";
import requireAdmin from "../middleware/requireAdmin.js";
import validateToken from "../middleware/validateToken.js";

const router = express.Router();

// Get current user's permissions (any authenticated user)
router.get("/me", validateToken, getCurrentUserPermissions);

// Get all permissions (admin only)
router.get("/", validateToken, requireAdmin, getAllPermissions);

// Get permissions by role (admin only)
router.get("/:role", validateToken, requireAdmin, getPermissionsByRole);

// Update permissions (admin only)
router.put("/", validateToken, requireAdmin, updatePermissions);

// Reset permissions to default (admin only)
router.post("/reset/:role", validateToken, requireAdmin, resetPermissionsToDefault);

export default router;
