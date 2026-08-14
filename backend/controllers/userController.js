import { getAllUsers, getUserByUsernameModel, updateUser } from "../models/users.js";
import { updateUserStats, calculateLeaderboard, getUserStats } from "../services/statsService.js";

/**
 * User Controller - Handles user profile and statistics operations
 */

export const updateStats = (req, res) => {
  const { username, scoreIncrement, solvedIncrement } = req.body;

  console.log(`📊 Updating stats for user: ${username}`);

  if (!username) {
    return res.status(400).json({
      success: false,
      error: "Missing username"
    });
  }

  try {
    const user = getUserByUsernameModel(username);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Update stats
    updateUserStats(user, {
      scoreIncrement: scoreIncrement || 0,
      solvedIncrement: solvedIncrement || 0
    });

    // Save updated user
    updateUser(username, user);

    console.log(`✅ Stats updated for user: ${username}`);

    return res.json({
      success: true,
      user: getUserStats(user)
    });
  } catch (err) {
    console.error(`❌ Error updating stats:`, err.message);
    res.status(500).json({
      success: false,
      error: "Failed to update stats",
      message: err.message
    });
  }
};

export const getLeaderboard = (req, res) => {
  const { limit = 10 } = req.query;

  console.log(`📈 Fetching leaderboard (limit: ${limit})`);

  try {
    const users = getAllUsers();
    const leaderboard = calculateLeaderboard(users, parseInt(limit));

    console.log(`✅ Leaderboard generated with ${leaderboard.length} entries`);

    res.json({
      success: true,
      leaderboard: leaderboard
    });
  } catch (err) {
    console.error(`❌ Error fetching leaderboard:`, err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch leaderboard",
      message: err.message
    });
  }
};

export const getUserProfile = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized"
    });
  }

  try {
    const user = getUserByUsernameModel(req.session.user.username);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    console.log(`✅ Profile fetched for user: ${user.username}`);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.name,
        role: user.role,
        stats: getUserStats(user)
      }
    });
  } catch (err) {
    console.error(`❌ Error fetching profile:`, err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile",
      message: err.message
    });
  }
};

export const getAllUserProfiles = (req, res) => {
  console.log("📋 Fetching all user profiles");

  try {
    const users = getAllUsers();
    const profiles = users.map((user) => ({
      id: user.id,
      username: user.username,
      fullname: user.name,
      role: user.role,
      stats: getUserStats(user)
    }));

    res.json({
      success: true,
      users: profiles,
      totalUsers: profiles.length
    });
  } catch (err) {
    console.error(`❌ Error fetching user profiles:`, err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user profiles",
      message: err.message
    });
  }
};
