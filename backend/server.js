import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to users file
const usersFile = path.resolve("DB/user.json");

// Load users
let users = [];
try {
  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile, "utf-8");
    users = JSON.parse(data || "[]");
    console.log(`📂 Loaded ${users.length} users from DB/user.json`);
  }
} catch (err) {
  console.error("❌ Failed to load users:", err.message);
}

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("📥 Incoming login request:", { username, password });

  if (!username || !password) {
    console.warn("⚠️ Missing credentials in request");
    return res
      .status(400)
      .json({ success: false, message: "Missing credentials" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    console.log(`✅ Login successful for user: ${username}`);
    res.json({ success: true, message: "Login successful", user });
  } else {
    console.warn(`❌ Invalid login attempt for username: ${username}`);
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
