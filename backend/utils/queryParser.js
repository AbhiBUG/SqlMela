/**
 * Validates table name to prevent SQL injection
 * @param {string} tableName - The table name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateTableName = (tableName) => {
  return /^[a-zA-Z0-9_]+$/.test(tableName);
};

/**
 * Parses SQL query type (SELECT, INSERT, UPDATE, DELETE, etc.)
 * @param {string} query - The SQL query string
 * @returns {string} - Query type in uppercase
 */
export const parseQueryType = (query) => {
  const match = query.trim().match(/^(\w+)/i);
  return match ? match[1].toUpperCase() : "UNKNOWN";
};

/**
 * Sanitizes SQL query (basic validation)
 * @param {string} query - The SQL query to sanitize
 * @returns {string} - Sanitized query
 */
export const sanitizeQuery = (query) => {
  return query.trim();
};

/**
 * Checks if query contains dangerous operations (for non-admin users)
 * @param {string} query - The SQL query to check
 * @returns {boolean} - True if dangerous, false otherwise
 */
export const isDangerousQuery = (query) => {
  const dangerousKeywords = ["DROP", "TRUNCATE", "DELETE", "RENAME"];
  const upperQuery = query.trim().toUpperCase();
  
  for (let keyword of dangerousKeywords) {
    if (upperQuery.includes(keyword)) {
      return true;
    }
  }
  
  return false;
};
