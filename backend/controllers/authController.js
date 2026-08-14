import { validateUserCredentials, getUserByUsernameModel, updateUser } from "../models/users.js";

/**
 * Auth Controller - Handles authentication-related operations
 */

export const login = (req, res) => {
  const { username, password } = req.body;

  console.log("📝 Login request:", { username });

  if (!username || !password) {
    console.warn("⚠️  Missing credentials in request");
    return res.status(400).json({
      success: false,
      message: "Missing credentials"
    });
  }

  const user = validateUserCredentials(username, password);

  if (!user) {
    console.warn(`❌ Invalid login attempt for username: ${username}`);
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  // Store user in session
  req.session.user = {
    id: user.id,
    username: user.username,
    fullname: user.name,
    role: user.role
  };

  req.session.save((err) => {
    if (err) {
      console.error("❌ Session save error:", err);
      return res.status(500).json({
        success: false,
        message: "Session error"
      });
    }

    console.log(`✅ Login successful for user: ${username}`);

    // Check maintenance mode
    const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
    if (isMaintenance && user.role !== "developer") {
      return res.json({
        success: true,
        maintenance: true,
        message: "Site Under Maintenance"
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        fullname: user.name,
        role: user.role
      }
    });
  });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }

    console.log("✅ User logged out successfully");
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });
};

export const getSession = (req, res) => {
  if (!req.session.user) {
    return res.json({
      success: false,
      user: null
    });
  }

  return res.json({
    success: true,
    user: req.session.user
  });
};
