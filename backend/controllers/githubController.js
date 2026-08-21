// import { createOrUpdateGitHubAccount, getGitHubAccountByUserId } from "../models/githubAccounts.js";
// import * as GitHubService from "../services/githubService.js";

// /**
//  * GitHub Controller - Handles GitHub OAuth and repository operations
//  */

// export const handleGitHubCallback = async (req, res) => {
//   try {
//     const { profile, accessToken } = req.user;

//     if (!req.session.user) {
//       return res.status(401).json({
//         success: false,
//         message: "User session not found"
//       });
//     }

//     // Store GitHub account in database
//     await createOrUpdateGitHubAccount(
//       req.session.user.id,
//       profile.username,
//       accessToken
//     );

//     console.log(`✅ GitHub account linked for user: ${profile.username}`);

//     // Redirect to practice page
//     res.redirect("https://sqlmelafrontend.onrender.com/practice");
//   } catch (err) {
//     console.error("❌ Error in GitHub callback:", err.message);
//     res.status(500).json({
//       success: false,
//       message: "GitHub authentication failed",
//       error: err.message
//     });
//   }
// };

// export const getUserGitHubAccount = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized"
//       });
//     }

//     const gitHubAccount = await getGitHubAccountByUserId(req.session.user.id);

//     if (!gitHubAccount) {
//       return res.status(404).json({
//         success: false,
//         message: "GitHub account not linked"
//       });
//     }

//     res.json({
//       success: true,
//       account: {
//         username: gitHubAccount.github_username,
//         linkedAt: gitHubAccount.created_at
//       }
//     });
//   } catch (err) {
//     console.error("❌ Error fetching GitHub account:", err.message);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching GitHub account",
//       error: err.message
//     });
//   }
// };

// export const getUserRepos = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized"
//       });
//     }

//     const gitHubAccount = await getGitHubAccountByUserId(req.session.user.id);

//     if (!gitHubAccount) {
//       return res.status(404).json({
//         success: false,
//         message: "GitHub account not linked"
//       });
//     }

//     const repos = await GitHubService.getGitHubUserRepos(
//       gitHubAccount.access_token,
//       gitHubAccount.github_username
//     );

//     res.json({
//       success: true,
//       repos: repos
//     });
//   } catch (err) {
//     console.error("❌ Error fetching repositories:", err.message);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching repositories",
//       error: err.message
//     });
//   }
// };

// export const getRepoContent = async (req, res) => {
//   try {
//     const { owner, repo, path } = req.body;

//     if (!owner || !repo) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing owner or repo parameter"
//       });
//     }

//     if (!req.session.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized"
//       });
//     }

//     const gitHubAccount = await getGitHubAccountByUserId(req.session.user.id);

//     if (!gitHubAccount) {
//       return res.status(404).json({
//         success: false,
//         message: "GitHub account not linked"
//       });
//     }

//     const content = await GitHubService.getGitHubRepoContent(
//       gitHubAccount.access_token,
//       owner,
//       repo,
//       path || ''
//     );

//     res.json({
//       success: true,
//       content: content
//     });
//   } catch (err) {
//     console.error("❌ Error fetching repo content:", err.message);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching repository content",
//       error: err.message
//     });
//   }
// };



import * as GitHubService from "../services/githubService.js";

/**
 * GitHub Controller - Handles GitHub OAuth and repository operations
 */

export const handleGitHubCallback = async (req, res) => {
  try {
    console.log("Insidle GitHub callback handler");
    const { profile, accessToken } = req.user;

    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "User session not found"
      });
    }

    // Store GitHub data in session
req.session.github = {
  id: profile.id,
  username: profile.username,
  accessToken,
  linkedAt: new Date().toISOString()
};

req.session.save((err) => {
  if (err) {
    console.error("Session save error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to save GitHub session"
    });
  }

  res.redirect("https://sqlmelafrontend.onrender.com/home");
});
  } catch (err) {
    console.error("❌ Error in GitHub callback:", err.message);

    res.status(500).json({
      success: false,
      message: "GitHub authentication failed",
      error: err.message
    });
  }
};

export const getUserGitHubAccount = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const gitHubAccount = req.session.github;

    if (!gitHubAccount) {
      return res.status(404).json({
        success: false,
        message: "GitHub account not linked"
      });
    }

    res.json({
      success: true,
      account: {
        username: gitHubAccount.username,
        linkedAt: gitHubAccount.linkedAt
      }
    });
  } catch (err) {
    console.error("❌ Error fetching GitHub account:", err.message);

    res.status(500).json({
      success: false,
      message: "Error fetching GitHub account",
      error: err.message
    });
  }
};

export const getUserRepos = async (req, res) => {
  console.log("Inside user Repos fetch");
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const gitHubAccount = req.session.github;

    if (!gitHubAccount) {
      return res.status(404).json({
        success: false,
        message: "GitHub account not linked"
      });
    }

    const repos = await GitHubService.getGitHubUserRepos(
      gitHubAccount.accessToken,
      gitHubAccount.username
    );

    res.json({
      success: true,
      repos
    });
  } catch (err) {
    console.error("❌ Error fetching repositories:", err.message);

    res.status(500).json({
      success: false,
      message: "Error fetching repositories",
      error: err.message
    });
  }
};

export const getRepoContent = async (req, res) => {
  console.log("Inside get Repo Content");
  try {
    const { owner, repo, path } = req.body;

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        message: "Missing owner or repo parameter"
      });
    }

    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const gitHubAccount = req.session.github;

    if (!gitHubAccount) {
      return res.status(404).json({
        success: false,
        message: "GitHub account not linked"
      });
    }

    const content = await GitHubService.getGitHubRepoContent(
      gitHubAccount.accessToken,
      owner,
      repo,
      path || ""
    );

    res.json({
      success: true,
      content
    });
  } catch (err) {
    console.error("❌ Error fetching repo content:", err.message);

    res.status(500).json({
      success: false,
      message: "Error fetching repository content",
      error: err.message
    });
  }
};
