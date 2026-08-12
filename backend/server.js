import express, { urlencoded } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import pkg from "pg";
import session from 'express-session';
const { Pool } = pkg;
import {checkLoggedIn} from './middlewares.js'
const app = express();
const PORT = 5000;
// Middleware
app.use(cors({
    origin: "https://sqlmelafrontend.onrender.com",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
// Path to users file
const usersFile = path.resolve("DB/user.json");

const ensureUserStats = (user) => ({
  score: 0,
  gamesPlayed: 0,
  problemsSolved: 0,
  accuracy: 0,
  streak: 0,
  xp: 0,
  ...user,
});

const saveUsers = () => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("❌ Failed to save users:", err.message);
  }
};

// Load users
let users = [];
try {
  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile, "utf-8");
    users = JSON.parse(data || "[]");
    users = users.map(ensureUserStats);
    console.log(`Loaded ${users.length} users from DB/user.json`);
  }
} catch (err) {
  console.error("Failed to load users:", err.message);
}

app.use(session({
  secret : 'my_session_secret',
  resave:true,
  saveUninitialized:false,
  name:'manfra.io',

    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60
    }
}))

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log(" Incoming login request:", { username, password });

  if (!username || !password) {
    console.warn("Missing credentials in request");
    return res.status(400).json({ success: false, message: "Missing credentials" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  
  if (user) {
    console.log(`Login successful for user: ${username}`);
    req.session.user = {id:user.id,username:user.username,fullname:user.name};
    res.json({ success: true, message: "Login successful", user });
  } else {
    console.warn(`Invalid login attempt for username: ${username}`);
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// PostgreSQL connection
// const pool = new Pool({
//   user: "postgres",       // change this
//   host: "localhost",      // or your DB host
//   database: "sqlMela",    // your DB name
//   password: "1234",       // change this
//   port: 5432,             // default postgres port
// });


//Hosted
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test DB connection once
pool.connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Failed to connect to DB:", err.message));

// Route to fetch table data
app.get("/api/table/:tableName", async (req, res) => {
  const { tableName } = req.params;

  console.log(`Incoming request for table: "${tableName}"`);

  try {
    // Validate table name to avoid SQL injection
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      console.warn(`Invalid table name received: "${tableName}"`);
      return res.status(400).json({ error: "Invalid table name" });
    }

    console.log(`Executing query: SELECT * FROM ${tableName} LIMIT 100`);
    const result = await pool.query(`SELECT * FROM ${tableName} LIMIT 100`);

    console.log(`Query successful. Rows returned: ${result.rowCount}`);
    res.json(result.rows);
  } catch (err) {
    console.error(` DB Error while fetching "${tableName}":`, err.message);
    res.status(500).json({ error: "Database query failed" });
  }
});

// app.get("/session", (req, res) => {
//     console.log("Session:", req.session);

//     res.json({
//         sessionID: req.sessionID,
//         user: req.session.user || null
//     });
// });

app.post("/api/query/:tableName",checkLoggedIn, async (req, res) => {
  const { tableName } = req.params;
  const { query } = req.body;

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/validate-output", async (req, res) => {
    const { query } = req.body;

    try {
        const result = await pool.query(query);

        res.json(result.rows);
    } catch (err) {
        res.status(400).json({
            error: err.message,
        });
    }
});

// Update user stats after a completed run
const updateUserStats = ({ username, scoreIncrement = 0, solvedIncrement = 0 }) => {
  const user = users.find((u) => u.username === username);
  if (!user) return null;

  user.score += scoreIncrement;
  user.gamesPlayed += scoreIncrement > 0 || solvedIncrement > 0 ? 1 : 0;
  user.problemsSolved += solvedIncrement;
  user.accuracy = user.gamesPlayed > 0 ? Math.round((user.problemsSolved / user.gamesPlayed) * 100) : 0;
  user.streak = user.streak + 1;
  user.xp += scoreIncrement;

  saveUsers();
  return user;
};

app.post("/user/update-stats", (req, res) => {
  const { username, scoreIncrement, solvedIncrement } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  const user = updateUserStats({ username, scoreIncrement, solvedIncrement });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ success: true, user });
});

app.get("/leaderboard", (req, res) => {
  const leaderboard = [...users]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((user) => ({
      username: user.username,
      score: user.score,
      gamesPlayed: user.gamesPlayed,
      problemsSolved: user.problemsSolved,
      accuracy: user.accuracy,
      streak: user.streak,
      xp: user.xp,
    }));

  res.json(leaderboard);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
