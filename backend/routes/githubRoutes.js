import express from "express";
import passport from "passport";
import * as GitHubController from "../controllers/githubController.js";
import { checkLoggedIn } from "../middlewares/authMiddleware.js";
import { checkGitHubToken } from "../middlewares/githubMiddleware.js";

const router = express.Router();

/**
 * GitHub OAuth Routes
 */

// GET /auth/github - Initiate GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["repo", "read:user"]
  })
);

// GET /auth/github/callback - GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  GitHubController.handleGitHubCallback
);

// GET /github/account - Get linked GitHub account
router.get(
  "/github/account",
  checkLoggedIn,
  GitHubController.getUserGitHubAccount
);

// GET /github/repos - Get user's GitHub repositories
router.get(
  "/github/repos",
  checkLoggedIn,
  GitHubController.getUserRepos
);

// POST /github/repo/content - Get repository content
router.post(
  "/github/repo/content",
  checkLoggedIn,
  GitHubController.getRepoContent
);

export default router;
