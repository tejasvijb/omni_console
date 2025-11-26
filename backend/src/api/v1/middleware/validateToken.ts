import type { JwtUserPayload } from "#/types/user.js";

import { type NextFunction, type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.model.js";

const validateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies.accessToken;
  console.log("Cookies:", req.cookies);
  console.log("Access Token:", authToken);
  if (!authToken) {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }

  const token = authToken as string;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    res.status(500);
    throw new Error("Internal server error: ACCESS_TOKEN_SECRET is not defined");
  }

  let decodedToken: { user: JwtUserPayload };
  try {
    decodedToken = jwt.verify(token, accessTokenSecret) as { user: JwtUserPayload };
  } catch {
    res.status(401);
    throw new Error("User is not authorized");
  }

  const dbUser = await UserModel.findById(decodedToken.user.id).lean().exec();
  if (!dbUser) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  req.user = {
    email: dbUser.email,
    id: String(dbUser._id),
    role: dbUser.role,
  };

  next();
});

export default validateToken;
