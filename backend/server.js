import express from "express";
import cors from "cors";
// import passport from "./config/passport.js";
import sessionConfig from "./config/session.js";
import { maintenanceMiddleware, logMaintenanceStatus } from "./middlewares/maintenanceMiddleware.js";
import { initializeUsers } from "./models/users.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ===========================
// Middleware Setup
// ===========================

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://sqlmelafrontend.onrender.com",
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust proxy (for deployment on render.com)
app.set("trust proxy", 1);

// Session Middleware
app.use(sessionConfig);

// Passport Authentication Middleware

// app.use(passport.initialize());
// app.use(passport.session());

// Maintenance Mode Middleware
app.use(maintenanceMiddleware);

// ===========================
// Initialize Data
// ===========================

console.log("Initializing SqlMela Backend Server...\n");

// Initialize users from file
const users = initializeUsers();
console.log(`Loaded ${users.length} users from database\n`);

// Log maintenance status
logMaintenanceStatus();
console.log("");

// ===========================
// Route Mounting
// ===========================

// Auth Routes (login, logout, session)
app.use("/auth", authRoutes);

// GitHub Routes (OAuth, repos, etc.)
app.use("/auth", githubRoutes);

// Query Routes (table data, query execution)
app.use("/api", queryRoutes);

// Leaderboard Routes
app.use("/leaderboard", leaderboardRoutes);

// User Routes (profile, stats, etc.)
app.use("/user", userRoutes);

// ===========================
// Health Check Endpoint
// ===========================

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// ===========================
// Error Handling Middleware
// ===========================

app.use((err, req, res, next) => {
  console.error(" Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "An error occurred"
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`
  });
});

// ===========================
// Server Startup
// ===========================

app.listen(PORT, () => {
  console.log("━".repeat(50));
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log("━".repeat(50));
  console.log("\nAvailable Routes:");
  console.log("  • POST   /auth/login");
  console.log("  • POST   /auth/logout");
  console.log("  • GET    /auth/session");
  console.log("  • GET    /auth/github");
  console.log("  • GET    /auth/github/callback");
  console.log("  • GET    /auth/github/account");
  console.log("  • GET    /auth/github/repos");
  console.log("  • POST   /auth/github/repo/content");
  console.log("  • GET    /api/table/:tableName");
  console.log("  • POST   /api/query/:tableName");
  console.log("  • POST   /api/validate-output");
  console.log("  • GET    /leaderboard");
  console.log("  • POST   /user/update-stats");
  console.log("  • GET    /user/profile");
  console.log("  • GET    /user/all");
  console.log("  • GET    /health");
  console.log("");
});

export default app;
