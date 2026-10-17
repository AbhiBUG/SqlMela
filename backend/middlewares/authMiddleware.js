// /**
//  * Authentication middleware - checks if user is logged in
//  */
// export const checkLoggedIn = (req, res, next) => {
//     console.log("=== AUTH DEBUG ===");
//   console.log("Origin:", req.headers.origin);
//   console.log("Cookie:", req.headers.cookie);
//   console.log("Session ID:", req.sessionID);
//   console.log("Session:", req.session);
//   console.log("User:", req.session?.user);
//   if (req.session && req.session.user) {
//     return next();
//   }
  
//   res.status(401).json({
//     success: false,
//     message: "Unauthorized: Please login first"
//   });
// };

// /**
//  * Authentication middleware - checks if user is admin/developer
//  */
// export const checkDeveloper = (req, res, next) => {
//   if (req.session && req.session.user && req.session.user.role === "developer") {
//     return next();
//   }
  
//   res.status(403).json({
//     success: false,
//     message: "Forbidden: Developer access required"
//   });
// };

// /**
//  * Get current user from session
//  */
// export const getCurrentUser = (req) => {
//   return req.session?.user || null;
// };



import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const checkLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required"
    });
  }

  try {
    const decoded = jwt.verify(
      authHeader.slice(7),
      process.env.JWT_SECRET
    );

    req.auth = { userId: decoded.sub };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export const checkDeveloper = async (req, res, next) => {
  if (!req.auth?.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  try {
    const result = await pool.query(
      "SELECT role FROM users WHERE id = $1",
      [req.auth.userId]
    );

    if (result.rows[0]?.role !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Developer access required"
      });
    }

    next();
  } catch (error) {
    console.error("Developer authorization error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getCurrentUser = (req) => req.auth || null;