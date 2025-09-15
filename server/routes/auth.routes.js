import express from "express";
import { isAuthUser, login, register } from "../controller/auth.controller.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);
router.get("/me", isAuth, isAuthUser);

export default router;