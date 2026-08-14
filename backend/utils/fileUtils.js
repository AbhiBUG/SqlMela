import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFile = path.resolve(__dirname, "../DB/user.json");

export const ensureUserStats = (user) => ({
  score: 0,
  gamesPlayed: 0,
  problemsSolved: 0,
  accuracy: 0,
  streak: 0,
  xp: 0,
  ...user,
});

export const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf-8");
    console.log("✅ Users saved successfully");
  } catch (err) {
    console.error("❌ Failed to save users:", err.message);
    throw err;
  }
};

export const loadUsers = () => {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, "utf-8");
      let users = JSON.parse(data || "[]");
      users = users.map(ensureUserStats);
      console.log(`✅ Loaded ${users.length} users from DB/user.json`);
      return users;
    }
    return [];
  } catch (err) {
    console.error("❌ Failed to load users:", err.message);
    return [];
  }
};

export const getUserByUsername = (users, username) => {
  return users.find((u) => u.username === username);
};

export const verifyUserCredentials = (users, username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
};
