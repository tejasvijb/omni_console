import type { JwtUserPayload, LoginUserBody, RegisterUserBody } from "#/types/user.js";
import type { CookieOptions, Request, Response } from "express";
import type { StringValue } from "ms";

import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.model.js";
const TOKEN_EXPIRY: StringValue = "15m";

const normalizeEmail = (email?: string) => email?.trim().toLowerCase() ?? "";

const buildUserPayload = (user: { _id: unknown; email: string; role: JwtUserPayload["role"] }): JwtUserPayload => ({
  email: user.email,
  id: typeof user._id === "string" ? user._id : String(user._id),
  role: user.role,
});

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as RegisterUserBody;
  const email = normalizeEmail(body.email);
  const password = body.password;
  const role = body.role ?? "viewer";

  if (!email || !password) {
    res.status(400);
    throw new Error("Missing required registration fields");
  }

  const existingUser = await UserModel.findOne({ email }).lean().exec();
  if (existingUser) {
    res.status(409);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    email,
    password: hashedPassword,
    role,
  });

  const payload = buildUserPayload(user.toObject());
  res.status(201).json({ user: payload });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    res.status(500);
    throw new Error("Access token secret is not defined");
  }

  const body = req.body as LoginUserBody;
  const email = normalizeEmail(body.email);
  const password = body.password;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await UserModel.findOne({ email }).select("+password").exec();
  if (!user || !user.password) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const payload = buildUserPayload(user);
  const accessToken = jwt.sign({ user: payload }, accessTokenSecret, {
    expiresIn: TOKEN_EXPIRY,
  });
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("accessToken", accessToken, cookieOptions);

  res.status(200).json({ user: payload });
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out successfully" });
});
