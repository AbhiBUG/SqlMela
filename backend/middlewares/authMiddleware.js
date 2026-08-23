/**
 * Authentication middleware - checks if user is logged in
 */
export const checkLoggedIn = (req, res, next) => {
    console.log("=== AUTH DEBUG ===");
  console.log("Origin:", req.headers.origin);
  console.log("Cookie:", req.headers.cookie);
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  console.log("User:", req.session?.user);
  if (req.session && req.session.user) {
    return next();
  }
  
  res.status(401).json({
    success: false,
    message: "Unauthorized: Please login first"
  });
};

/**
 * Authentication middleware - checks if user is admin/developer
 */
export const checkDeveloper = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "developer") {
    return next();
  }
  
  res.status(403).json({
    success: false,
    message: "Forbidden: Developer access required"
  });
};

/**
 * Get current user from session
 */
export const getCurrentUser = (req) => {
  return req.session?.user || null;
};
