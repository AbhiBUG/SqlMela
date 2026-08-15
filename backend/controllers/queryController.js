import pool from "../config/db.js";
import { validateTableName } from "../utils/queryParser.js";
import alasql from "alasql";

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const SANDBOX_TABLES = ["students", "teachers"];

/*
|--------------------------------------------------------------------------
| Initialize sandbox
|--------------------------------------------------------------------------
*/

const initializeSandbox = async (req) => {
  if (
    req.session.userSandbox &&
    req.session.solutionSandbox
  ) {
    return;
  }

  const [studentsResult, teachersResult] =
    await Promise.all([
      pool.query("SELECT * FROM students"),
      pool.query("SELECT * FROM teachers"),
    ]);

  const baseSandbox = {
    students: structuredClone(studentsResult.rows),
    teachers: structuredClone(teachersResult.rows),
  };

  /*
   * User sandbox and solution sandbox must be
   * completely independent.
   */
  req.session.userSandbox = structuredClone(
    baseSandbox
  );

  req.session.solutionSandbox = structuredClone(
    baseSandbox
  );

  console.log("Sandbox initialized");
};

/*
|--------------------------------------------------------------------------
| Load sandbox into AlaSQL
|--------------------------------------------------------------------------
|
| IMPORTANT:
| AlaSQL is global in Node.js.
| Therefore we always clear the previous tables
| before loading a sandbox.
|
*/

const loadSandboxIntoAlaSQL = (sandbox) => {
  // Remove old tables
  for (const table of SANDBOX_TABLES) {
    try {
      alasql(`DROP TABLE IF EXISTS ${table}`);
    } catch (err) {
      // Ignore table-not-found errors
    }
  }

  /*
   * Create tables using the first row to infer columns.
   */
  for (const table of SANDBOX_TABLES) {
    const rows = structuredClone(
      sandbox[table] || []
    );

    alasql(`CREATE TABLE ${table}`);

    alasql.tables[table].data = rows;
  }
};

/*
|--------------------------------------------------------------------------
| Extract current AlaSQL state
|--------------------------------------------------------------------------
*/

const saveSandboxFromAlaSQL = () => {
  return {
    students: structuredClone(
      alasql.tables.students?.data || []
    ),

    teachers: structuredClone(
      alasql.tables.teachers?.data || []
    ),
  };
};

/*
|--------------------------------------------------------------------------
| Normalize SQL result
|--------------------------------------------------------------------------
|
| SQL result comparison should not depend on
| object property ordering.
|
*/

const normalizeRows = (rows) => {
  if (!Array.isArray(rows)) {
    return rows;
  }

  return rows.map((row) => {
    if (
      row === null ||
      typeof row !== "object" ||
      Array.isArray(row)
    ) {
      return row;
    }

    const sortedRow = {};

    Object.keys(row)
      .sort()
      .forEach((key) => {
        sortedRow[key] = row[key];
      });

    return sortedRow;
  });
};

/*
|--------------------------------------------------------------------------
| Compare SQL results
|--------------------------------------------------------------------------
*/

const compareResults = (
  userResult,
  solutionResult
) => {
  const user = normalizeRows(
    structuredClone(userResult)
  );

  const solution = normalizeRows(
    structuredClone(solutionResult)
  );

  /*
   * For SELECT queries we normally care about
   * the returned rows.
   */
  return (
    JSON.stringify(user) ===
    JSON.stringify(solution)
  );
};

/*
|--------------------------------------------------------------------------
| Compare sandbox state
|--------------------------------------------------------------------------
*/

const compareSandboxState = (
  userSandbox,
  solutionSandbox
) => {
  for (const table of SANDBOX_TABLES) {
    const userRows = normalizeRows(
      userSandbox[table] || []
    );

    const solutionRows = normalizeRows(
      solutionSandbox[table] || []
    );

    if (
      JSON.stringify(userRows) !==
      JSON.stringify(solutionRows)
    ) {
      return false;
    }
  }

  return true;
};

/*
|--------------------------------------------------------------------------
| GET TABLE DATA
|--------------------------------------------------------------------------
*/

export const getTableData = async (req, res) => {
  const { tableName } = req.params;

  if (!validateTableName(tableName)) {
    return res.status(400).json({
      success: false,
      error: "Invalid table name",
    });
    console.log("Error : Invalid table name");
  }

  try {
    await initializeSandbox(req);

    const table =
      req.session.userSandbox[tableName];

    if (!table) {
      return res.status(404).json({
        success: false,
        error: "Table not found",
      });
      console.log("Error : Table not found");
    }

    return res.json(table);
  } catch (err) {
    console.error(
      "getTableData error:",
      err
    );

    return res.status(500).json({
      success: false,
      error: "Failed to fetch table data",
    });
    console.log("Error : Failed to fetch table.");
  }
};

/*
|--------------------------------------------------------------------------
| EXECUTE USER QUERY
|--------------------------------------------------------------------------
|
| This executes ONLY against the user's sandbox.
|
*/

export const executeQuery = async (req, res) => {
  const { query } = req.body;

  if (
    !query ||
    typeof query !== "string"
  ) {
    return res.status(400).json({
      success: false,
      error: "Missing query",
    });
    console.log("Error Missing query");
  }

  try {
    await initializeSandbox(req);

    /*
     * Load user's current sandbox.
     */
    loadSandboxIntoAlaSQL(
      structuredClone(
        req.session.userSandbox
      )
    );

    /*
     * Execute user query.
     */
    const result = alasql(query);

    /*
     * Save mutations back into user's sandbox.
     */
    req.session.userSandbox =
      saveSandboxFromAlaSQL();

    /*
     * Session changes should be saved before
     * responding.
     */
    await new Promise(
      (resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    );

    return res.json({
      success: true,

      rows: Array.isArray(result)
        ? result
        : [],

      affectedRows:
        Array.isArray(result)
          ? 0
          : result,
    });
  } catch (err) {
    console.error(
      "executeQuery error:",
      err
    );

    return res.status(400).json({
      success: false,
      error: err.message,
    });
    console.log("Error Unexpected execution errror");
  }
};

/*
|--------------------------------------------------------------------------
| COMPARE USER QUERY WITH SOLUTION
|--------------------------------------------------------------------------
*/

export const compareQuery = async ( //called from resultWindow
  req,
  res
) => {
  const {
    userQuery,
    solutionQuery,
  } = req.body;

  if (
    !userQuery ||
    typeof userQuery !== "string"
  ) {
    return res.status(400).json({
      success: false,
      error: "Missing userQuery",
    });
    console.log("Error : Missing userQuery");
  }

  if (
    !solutionQuery ||
    typeof solutionQuery !== "string"
  ) {
    return res.status(400).json({
      success: false,
      error: "Missing solutionQuery",
    });
    console.log("Error : Missing solutionQuery");
  }

  try {
    await initializeSandbox(req);

    /*
     * ----------------------------------------------------
     * USER QUERY
     * ----------------------------------------------------
     *
     * Start from the user's CURRENT sandbox.
     */

    const userStartingSandbox =
      structuredClone(
        req.session.userSandbox
      );

    loadSandboxIntoAlaSQL(
      userStartingSandbox
    );

    const userResult =
      alasql(userQuery);

    const finalUserSandbox =
      saveSandboxFromAlaSQL();

    /*
     * ----------------------------------------------------
     * SOLUTION QUERY
     * ----------------------------------------------------
     *
     * IMPORTANT:
     *
     * The solution always starts from the
     * ORIGINAL solution sandbox.
     *
     * It never uses the user's modified state.
     */

    const solutionStartingSandbox =
      structuredClone(
        req.session.solutionSandbox
      );

    loadSandboxIntoAlaSQL(
      solutionStartingSandbox
    );

    const solutionResult =
      alasql(solutionQuery);

    const finalSolutionSandbox =
      saveSandboxFromAlaSQL();

    /*
     * ----------------------------------------------------
     * COMPARE OUTPUT
     * ----------------------------------------------------
     */

    const outputMatch =
      compareResults(
        userResult,
        solutionResult
      );

    /*
     * ----------------------------------------------------
     * COMPARE FINAL DATABASE STATE
     * ----------------------------------------------------
     */

    const stateMatch =
      compareSandboxState(
        finalUserSandbox,
        finalSolutionSandbox
      );

    /*
     * ----------------------------------------------------
     * FINAL RESULT
     * ----------------------------------------------------
     */

    const correct =
      outputMatch &&
      stateMatch;

    /*
     * Save user's resulting sandbox.
     *
     * DO NOT save solution sandbox.
     */

    req.session.userSandbox =
      finalUserSandbox;

    /*
     * IMPORTANT:
     *
     * Do NOT delete solutionSandbox here.
     *
     * The solution sandbox represents the
     * original database state and should remain
     * available for future comparisons.
     */

    await new Promise(
      (resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    );

    return res.json({
      success: true,

      correct,

      outputMatch,

      stateMatch,

      rows: Array.isArray(userResult)
        ? userResult
        : [],

      affectedRows:
        Array.isArray(userResult)
          ? 0
          : userResult,
    });
  } catch (err) {
    console.error(
      "compareQuery error:",
      err
    );

    return res.status(400).json({
      success: false,
      error: err.message,
    });
    console.log("Error : Comparison error");
  }
};

/*
|--------------------------------------------------------------------------
| RESET SANDBOX
|--------------------------------------------------------------------------
*/

export const resetSandbox = async (
  req,
  res
) => {
  try {
    delete req.session.userSandbox;
    delete req.session.solutionSandbox;

    await initializeSandbox(req);

    await new Promise(
      (resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    );

    return res.json({
      success: true,
      message: "Sandbox reset",
    });
  } catch (err) {
    console.error(
      "resetSandbox error:",
      err
    );

    return res.status(500).json({
      success: false,
      error: "Failed to reset sandbox",
    });
  }
};