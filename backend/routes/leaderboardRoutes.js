import express from "express";
import * as UserController from "../controllers/userController.js";

const router = express.Router();

/**
 * Leaderboard Routes
 */

// GET /leaderboard - Get top users leaderboard
router.get("/", UserController.getLeaderboard);

export default router;
