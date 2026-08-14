import express from "express";
import * as QueryController from "../controllers/queryController.js";
import { checkLoggedIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Query Routes
 */

// GET /api/table/:tableName - Fetch table data (public)
router.get("/table/:tableName", QueryController.getTableData);

// POST /api/query/:tableName - Execute custom query (requires login)
router.post("/query/:tableName", checkLoggedIn, QueryController.executeQuery);

// POST /api/validate-output - Validate query output (requires login)
router.post("/validate-output", checkLoggedIn, QueryController.validateOutput);

export default router;
