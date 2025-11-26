import type { UserRole } from "#/types/user.js";

import mongoose, { Schema } from "mongoose";

type BaseUserAttributes = {
  email: string;
  password: string;
  role: UserRole;
};
type UserModelType = mongoose.Model<BaseUserAttributes>;

const userSchema = new Schema<BaseUserAttributes>(
  {
    email: {
      index: true,
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    password: {
      minlength: 8,
      required: true,
      select: false,
      type: String,
    },
    role: {
      default: "viewer",
      enum: ["admin", "analyst", "viewer"],
      type: String,
    },
  },
  {
    collection: "users",
    timestamps: true,
  },
);

const UserModel = (mongoose.models.User as UserModelType) ?? mongoose.model<BaseUserAttributes, UserModelType>("User", userSchema);

export default UserModel;
