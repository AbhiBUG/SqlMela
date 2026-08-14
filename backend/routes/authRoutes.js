import express from "express";
import * as AuthController from "../controllers/authController.js";
import { checkLoggedIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Authentication Routes
 */

// POST /auth/login - User login
router.post("/login", AuthController.login);

// POST /auth/logout - User logout
router.post("/logout", AuthController.logout);

// GET /auth/session - Get current session
router.get("/session", AuthController.getSession);

export default router;
