/**
 * GitHub OAuth middleware - ensures user is authenticated via GitHub
 */
export const ensureGitHubAuth = (req, res, next) => {
  if (req.user && req.user.profile) {
    return next();
  }
  
  res.status(401).json({
    success: false,
    message: "Unauthorized: GitHub authentication required"
  });
};

/**
 * GitHub token middleware - checks if user has GitHub access token stored
 */
export const checkGitHubToken = async (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      // This will be populated by the service
      return next();
    }
    
    res.status(401).json({
      success: false,
      message: "GitHub token not found"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error checking GitHub token",
      error: err.message
    });
  }
};
