import { validateUserCredentials, getUserByUsernameModel, updateUser } from "../models/users.js";

/**
 * Auth Controller - Handles authentication-related operations
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Login request:", { username });

    if (
      !username ||
      typeof username !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      console.warn("Missing credentials in request");

      return res.status(400).json({
        success: false,
        message: "Missing credentials"
      });
    }

    // Fetch user from PostgreSQL
    const result = await pool.query(
      `SELECT id, username, email, password_hash
       FROM users
       WHERE username = $1`,
      [username.trim()]
    );

    const user = result.rows[0];

    // Validate password against the stored bcrypt hash
    if (
      !user ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      console.warn(`Invalid login attempt for username: ${username}`);

      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT after successful authentication
    const token = jwt.sign(
      { sub: String(user.id) },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(" Logout error:", err);
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
