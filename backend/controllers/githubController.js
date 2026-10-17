
import * as GitHubService from "../services/githubService.js";
import pool from "../config/db.js";
import {
  encryptToken,
  decryptToken
} from "../utils/tokenEncryption.js";
import jwt from "jsonwebtoken";
const FRONTEND_URL = "https://sqlmelafrontend.onrender.com";




export const startGitHubOAuth = (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in to SqlMela first",
      });
    }

    const state = jwt.sign(
      {
        sub: String(userId),
        purpose: "github-link",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
        issuer: "sqlmela",
        audience: "github-link",
      }
    );

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri:
        "https://sqlmela.onrender.com/auth/github/callback",
      scope: "repo read:user",
      state,
    });

    return res.status(200).json({
      success: true,
      authorizationUrl:
        `https://github.com/login/oauth/authorize?${params.toString()}`,
    });
  } catch (error) {
    console.error("GitHub OAuth start error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not start GitHub linking",
    });
  }
};


// GitHub OAuth callback
export const handleGitHubCallback = async (req, res) => {
  try {
    const { profile, accessToken } = req.user || {};
    // const userId = req.session?.user?.id;

    // const userId = req.auth?.userId;

    
let statePayload;

try {
  statePayload = jwt.verify(req.query.state, process.env.JWT_SECRET, {
    issuer: "sqlmela",
    audience: "github-link",
  });
} catch {
  return res.status(401).send(
    "Invalid or expired GitHub linking request. Please try again."
  );
}

if (
  statePayload.purpose !== "github-link" ||
  !statePayload.sub
) {
  return res.status(401).send("Invalid GitHub linking request");
}

const userId = statePayload.sub;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in to SqlMela before linking GitHub"
      });
    }

    if (!profile?.id || !profile?.username || !accessToken) {
      return res.status(400).json({
        success: false,
        message: "Incomplete GitHub authentication data"
      });
    }

    const githubId = String(profile.id);
    const githubUsername = profile.username;
    const encryptedToken = encryptToken(accessToken);

    await pool.query(
      `INSERT INTO github_accounts (
         user_id,
         github_id,
         github_username,
         access_token_encrypted
       )
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id)
       DO UPDATE SET
         github_id = EXCLUDED.github_id,
         github_username = EXCLUDED.github_username,
         access_token_encrypted = EXCLUDED.access_token_encrypted`,
      [userId, githubId, githubUsername, encryptedToken]
    );

    return res.redirect(`${FRONTEND_URL}/home`);
  } catch (err) {
    console.error("GitHub callback error:", err.message);

    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This GitHub account may already be linked to another user"
      });
    }

    return res.status(500).json({
      success: false,
      message: "GitHub account linking failed"
    });
  }
};

// Get linked GitHub account
export const getUserGitHubAccount = async (req, res) => {
  try {
    // const userId = req.session?.user?.id;

    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const result = await pool.query(
      `SELECT github_id, github_username, linked_at
       FROM github_accounts
       WHERE user_id = $1`,
      [userId]
    );

    const account = result.rows[0];

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "GitHub account not linked"
      });
    }

    return res.json({
      success: true,
      account: {
        id: account.github_id,
        username: account.github_username,
        linkedAt: account.linked_at
      }
    });
  } catch (err) {
    console.error("GitHub account lookup error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Error fetching GitHub account"
    });
  }
};

// Get repositories
export const getUserRepos = async (req, res) => {
  try {
    // const userId = req.session?.user?.id;

    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const result = await pool.query(
      `SELECT access_token_encrypted, github_username
       FROM github_accounts
       WHERE user_id = $1`,
      [userId]
    );

    const account = result.rows[0];

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "GitHub account not linked"
      });
    }

    const accessToken = decryptToken(
      account.access_token_encrypted
    );

    const repos = await GitHubService.getGitHubUserRepos(
      accessToken,
      account.github_username
    );

    return res.json({
      success: true,
      repos
    });
  } catch (err) {
    console.error("Repository fetch error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Error fetching repositories"
    });
  }
};

// Get repository content
export const getRepoContent = async (req, res) => {
  try {
    const { owner, repo, path = "" } = req.body;

    if (
      typeof owner !== "string" || !owner.trim() ||
      typeof repo !== "string" || !repo.trim() ||
      typeof path !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid owner, repo, or path"
      });
    }

    // const userId = req.session?.user?.id;

    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const result = await pool.query(
      `SELECT access_token_encrypted
       FROM github_accounts
       WHERE user_id = $1`,
      [userId]
    );

    const account = result.rows[0];

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "GitHub account not linked"
      });
    }

    const accessToken = decryptToken(
      account.access_token_encrypted
    );

    const content = await GitHubService.getGitHubRepoContent(
      accessToken,
      owner.trim(),
      repo.trim(),
      path
    );

    return res.json({
      success: true,
      content
    });
  } catch (err) {
    console.error("Repository content error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Error fetching repository content"
    });
  }
};
