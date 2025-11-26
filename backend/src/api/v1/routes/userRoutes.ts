import express from "express";

import { loginUser, logoutUser, registerUser } from "../controllers/userController.js";
import validateToken from "../middleware/validateToken.js";

const router = express.Router();

router.get("/me", validateToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", validateToken, logoutUser);

export default router;
