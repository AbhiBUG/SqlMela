import { parseQueryType, isDangerousQuery, validateTableName } from "../utils/queryParser.js";

/**
 * SQL Analyzer Service - Analyzes and validates SQL queries
 */

export const analyzeQuery = (query) => {
  const analysis = {
    type: parseQueryType(query),
    isDangerous: isDangerousQuery(query),
    length: query.length,
    timestamp: new Date().toISOString()
  };
  
  return analysis;
};

export const validateQuery = (query, allowDangerous = false) => {
  if (!query || typeof query !== 'string') {
    return {
      valid: false,
      error: "Query must be a non-empty string"
    };
  }
  
  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length === 0) {
    return {
      valid: false,
      error: "Query cannot be empty"
    };
  }
  
  if (!allowDangerous && isDangerousQuery(trimmedQuery)) {
    return {
      valid: false,
      error: "Query contains dangerous operations"
    };
  }
  
  return {
    valid: true,
    error: null
  };
};

export const extractTableName = (query) => {
  try {
    // Basic pattern matching for common SQL statements
    const selectMatch = query.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    const insertMatch = query.match(/INTO\s+([a-zA-Z0-9_]+)/i);
    const updateMatch = query.match(/UPDATE\s+([a-zA-Z0-9_]+)/i);
    const deleteMatch = query.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    
    const tableName = selectMatch?.[1] || insertMatch?.[1] || updateMatch?.[1] || deleteMatch?.[1];
    
    if (tableName && validateTableName(tableName)) {
      return tableName;
    }
    
    return null;
  } catch (err) {
    console.error("Error extracting table name:", err.message);
    return null;
  }
};

export const getQuerySyntaxSuggestions = (queryType) => {
  const suggestions = {
    SELECT: "SELECT column1, column2 FROM table_name WHERE condition;",
    INSERT: "INSERT INTO table_name (column1, column2) VALUES (value1, value2);",
    UPDATE: "UPDATE table_name SET column1 = value1 WHERE condition;",
    DELETE: "DELETE FROM table_name WHERE condition;",
    JOIN: "SELECT * FROM table1 JOIN table2 ON table1.id = table2.id;",
    "GROUP BY": "SELECT column, COUNT(*) FROM table_name GROUP BY column;",
    ORDER_BY: "SELECT * FROM table_name ORDER BY column ASC/DESC;"
  };
  
  return suggestions[queryType.toUpperCase()] || "Unknown query type";
};
