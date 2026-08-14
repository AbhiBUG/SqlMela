import express from "express";
import * as UserController from "../controllers/userController.js";
import { checkLoggedIn, checkDeveloper } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * User Routes
 */

// POST /user/update-stats - Update user statistics (requires login)
router.post("/update-stats", checkLoggedIn, UserController.updateStats);

// GET /user/profile - Get current user profile (requires login)
router.get("/profile", checkLoggedIn, UserController.getUserProfile);

// GET /user/all - Get all user profiles (developer only)
router.get("/all", checkDeveloper, UserController.getAllUserProfiles);

export default router;
