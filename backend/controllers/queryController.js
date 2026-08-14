import pool from "../config/db.js";
import { validateTableName } from "../utils/queryParser.js";
import { analyzeQuery, validateQuery } from "../services/sqlAnalyzerService.js";

/**
 * Query Controller - Handles database query operations
 */

export const getTableData = async (req, res) => {
  const { tableName } = req.params;

  console.log(` Fetching table data for: "${tableName}"`);

  // Validate table name
  if (!validateTableName(tableName)) {
    console.warn(`❌ Invalid table name received: "${tableName}"`);
    return res.status(400).json({
      success: false,
      error: "Invalid table name"
    });
  }

  try {
    const query = `SELECT * FROM ${tableName} LIMIT 100`;
    console.log(`🔄 Executing query: ${query}`);

    const result = await pool.query(query);

    console.log(`✅ Query successful. Rows returned: ${result.rowCount}`);
    res.json({
      success: true,
      rowCount: result.rowCount,
      rows: result.rows
    });
  } catch (err) {
    console.error(`❌ DB Error for table "${tableName}":`, err.message);
    res.status(500).json({
      success: false,
      error: "Database query failed",
      message: err.message
    });
  }
};

export const executeQuery = async (req, res) => {
  const { tableName } = req.params;
  const { query } = req.body;

  console.log(`🔄 Executing custom query on table: "${tableName}"`);

  if (!tableName || !query) {
    return res.status(400).json({
      success: false,
      error: "Missing tableName or query"
    });
  }

  try {
    // Validate query
    const validation = validateQuery(query);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Analyze query
    const analysis = analyzeQuery(query);

    // Execute query
    const result = await pool.query(query);

    console.log(`✅ Query executed successfully. Rows returned: ${result.rowCount}`);

    res.json({
      success: true,
      rowCount: result.rowCount,
      rows: result.rows,
      analysis: analysis
    });
  } catch (err) {
    console.error(`❌ Query execution error:`, err.message);
    res.status(500).json({
      success: false,
      error: "Query execution failed",
      message: err.message
    });
  }
};

export const validateOutput = async (req, res) => {
  const { query } = req.body;

  console.log("🔍 Validating query output");

  if (!query) {
    return res.status(400).json({
      success: false,
      error: "Missing query"
    });
  }

  try {
    // Validate query
    const validation = validateQuery(query);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Execute and return results
    const result = await pool.query(query);

    console.log(`✅ Output validation successful. Rows: ${result.rowCount}`);

    res.json({
      success: true,
      rowCount: result.rowCount,
      rows: result.rows
    });
  } catch (err) {
    console.error(`❌ Validation error:`, err.message);
    res.status(400).json({
      success: false,
      error: "Query validation failed",
      message: err.message
    });
  }
};
