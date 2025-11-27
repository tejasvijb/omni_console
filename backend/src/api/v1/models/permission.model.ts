import type { PagePermission, ResourcePermission } from "#/types/permission.js";
import type { UserRole } from "#/types/user.js";

import mongoose, { Schema } from "mongoose";

type BasePermissionAttributes = {
  pages: PagePermission[];
  resources: ResourcePermission[];
  role: UserRole;
};

type PermissionModelType = mongoose.Model<BasePermissionAttributes>;

const pagePermissionSchema = new Schema<PagePermission>(
  {
    canAccess: {
      default: false,
      required: true,
      type: Boolean,
    },
    pageId: {
      enum: ["access-control", "dashboard", "workflows"],
      required: true,
      type: String,
    },
  },
  { _id: false },
);

const resourcePermissionSchema = new Schema<ResourcePermission>(
  {
    actions: {
      default: [],
      enum: ["create", "delete", "edit", "view"],
      type: [String],
    },
    resourceId: {
      enum: ["barChart1", "barChart2", "lineChart", "pieChart", "workflowItems"],
      required: true,
      type: String,
    },
  },
  { _id: false },
);

const permissionSchema = new Schema<BasePermissionAttributes>(
  {
    pages: {
      default: [],
      type: [pagePermissionSchema],
    },
    resources: {
      default: [],
      type: [resourcePermissionSchema],
    },
    role: {
      enum: ["admin", "analyst", "viewer"],
      index: true,
      required: true,
      type: String,
      unique: true,
    },
  },
  {
    collection: "permissions",
    timestamps: true,
  },
);

const PermissionModel =
  (mongoose.models.Permission as PermissionModelType) ??
  mongoose.model<BasePermissionAttributes, PermissionModelType>("Permission", permissionSchema);

export default PermissionModel;
