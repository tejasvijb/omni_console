import type { NextFunction, Request, Response } from "express";

import asyncHandler from "express-async-handler";

const requireAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User is not authenticated");
  }

  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied. Admin privileges required.");
  }

  next();
});

export default requireAdmin;
