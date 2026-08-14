/**
 * Maintenance mode middleware
 * If maintenance is enabled, only developers can access the application
 */
export const maintenanceMiddleware = (req, res, next) => {
  const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true' || false;
  
  // Allow passage if not in maintenance mode
  if (!MAINTENANCE_MODE) {
    return next();
  }
  
  // Allow developers to bypass maintenance mode
  if (req.session && req.session.user && req.session.user.role === "developer") {
    return next();
  }
  
  // Block non-developers during maintenance
  return res.status(503).json({
    success: false,
    maintenance: true,
    message: "Site is under maintenance. Please try again later."
  });
};

/**
 * Log maintenance mode status
 */
export const logMaintenanceStatus = () => {
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
  if (isMaintenance) {
    console.log("⚠️  MAINTENANCE MODE ENABLED - Only developers can access");
  } else {
    console.log("✅ Maintenance mode disabled");
  }
};
