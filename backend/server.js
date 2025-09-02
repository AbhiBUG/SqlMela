import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import pkg from "pg";
const { Pool } = pkg;

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

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",       // change this
  host: "localhost",      // or your DB host
  database: "sqlMela",    // your DB name
  password: "1234",       // change this
  port: 5432,             // default postgres port
});

// Test DB connection once
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch((err) => console.error("❌ Failed to connect to DB:", err.message));

// Route to fetch table data
app.get("/api/table/:tableName", async (req, res) => {
  const { tableName } = req.params;

  console.log(`📥 Incoming request for table: "${tableName}"`);

  try {
    // ⚠️ Validate table name to avoid SQL injection
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      console.warn(`⚠️ Invalid table name received: "${tableName}"`);
      return res.status(400).json({ error: "Invalid table name" });
    }

    console.log(`🔎 Executing query: SELECT * FROM ${tableName} LIMIT 100`);
    const result = await pool.query(`SELECT * FROM ${tableName} LIMIT 100`);

    console.log(`✅ Query successful. Rows returned: ${result.rowCount}`);
    res.json(result.rows);
  } catch (err) {
    console.error(`❌ DB Error while fetching "${tableName}":`, err.message);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
