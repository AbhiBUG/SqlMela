import pool from "../config/db.js";

/**
 * GitHub Accounts Model - Manages GitHub account data in database
 */

export const createOrUpdateGitHubAccount = async (userId, githubUsername, accessToken) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO github_accounts
      (
        user_id,
        github_username,
        access_token
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE
      SET 
        github_username = $2,
        access_token = $3,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
      `,
      [userId, githubUsername, accessToken]
    );

    console.log(`✅ GitHub account created/updated for user ${userId}`);
    return result.rows[0];
  } catch (err) {
    console.error("❌ Error creating/updating GitHub account:", err.message);
    throw err;
  }
};

export const getGitHubAccountByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM github_accounts WHERE user_id = $1;`,
      [userId]
    );

    return result.rows[0] || null;
  } catch (err) {
    console.error("❌ Error fetching GitHub account:", err.message);
    throw err;
  }
};

export const getGitHubAccountByUsername = async (githubUsername) => {
  try {
    const result = await pool.query(
      `SELECT * FROM github_accounts WHERE github_username = $1;`,
      [githubUsername]
    );

    return result.rows[0] || null;
  } catch (err) {
    console.error("❌ Error fetching GitHub account by username:", err.message);
    throw err;
  }
};

export const deleteGitHubAccount = async (userId) => {
  try {
    await pool.query(
      `DELETE FROM github_accounts WHERE user_id = $1;`,
      [userId]
    );

    console.log(`✅ GitHub account deleted for user ${userId}`);
  } catch (err) {
    console.error("❌ Error deleting GitHub account:", err.message);
    throw err;
  }
};

export const getAllGitHubAccounts = async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM github_accounts;`
    );

    return result.rows;
  } catch (err) {
    console.error("❌ Error fetching all GitHub accounts:", err.message);
    throw err;
  }
};
