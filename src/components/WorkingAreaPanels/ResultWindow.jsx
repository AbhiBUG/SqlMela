import React, { useState, useEffect } from "react";

export default function QueryResult({ tableName, validatorResult }) {
  const [result, setResult] = useState([]);
  const [queryExecuting, setQueryExecuting] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);

  const normalizeRows = (rows = []) =>
    rows.map((row) => Object.values(row));

  const areRowsEquivalent = (a = [], b = []) => {
    if (a.length !== b.length) return false;

    return (
      JSON.stringify(normalizeRows(a)) ===
      JSON.stringify(normalizeRows(b))
    );
  };

  const fetchQueryResult = async (query) => {
    const res = await fetch(
      `https://sqlmela.onrender.com/api/query/${tableName}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Query execution failed");
    }

    return data;
  };

  const validateOutput = async () => {
    try {
      setQueryExecuting(true);
      setComparisonResult(null);

      const userQuery =
        validatorResult?.results?.[0]?.statement;

      const solutionQuery =
        validatorResult?.solution;

      if (!userQuery || !solutionQuery) return;

      const userRows = await fetchQueryResult(userQuery);

      const solutionRows = await fetchQueryResult(solutionQuery);

      setResult(userRows);

      const matched = areRowsEquivalent(
        userRows,
        solutionRows
      );

      setComparisonResult({
        matched,
        message: matched
          ? "Correct Answer"
          : "Incorrect Output",
      });
    } catch (err) {
      console.error(err);

      setComparisonResult({
        matched: false,
        message: err.message,
      });

      setResult([]);
    } finally {
      setQueryExecuting(false);
    }
  };

  useEffect(() => {
    const isValid =
      validatorResult?.results?.[0]?.result?.valid;

    if (isValid) {
      validateOutput();
    }
  }, [validatorResult, tableName]);

  if (
    !validatorResult ||
    !validatorResult.results ||
    validatorResult.results.length === 0
  ) {
    return (
      <div className="border shadow bg-primary/50 p-4">
        No Results
      </div>
    );
  }

  const isValid =
    validatorResult?.results?.[0]?.result?.valid;

  const errors =
    validatorResult?.results?.[0]?.result?.errors;

  if (!isValid) {
    return (
      <div className="border shadow bg-primary/50 p-4">
        <h2 className="text-red-500 font-bold">
          Invalid SQL Syntax
        </h2>

        <p>
          {Array.isArray(errors)
            ? errors.join(", ")
            : errors}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-primary/50 h-full">

      <h2 className="text-green-400 font-bold">
        Valid Syntax
      </h2>

      {queryExecuting ? (
        <h2 className="text-white mt-4">
          Executing Query...
        </h2>
      ) : (
        <>
          {comparisonResult && (
            <h2
              className={`font-bold ${
                comparisonResult.matched
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {comparisonResult.message}
            </h2>
          )}

          {result?.length > 0 ? (
            <div className="p-3 overflow-x-auto w-full">
              <table className="table-auto w-full border-collapse border border-gray-300 text-[10px]">

                <thead>
                  <tr>
                    {Object.keys(result[0]).map((col) => (
                      <th
                        key={col}
                        className="border px-4 py-2 bg-gray-700 text-white"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {result.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="border px-4 py-2 text-white"
                        >
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          ) : (
            <h2 className="text-yellow-400">
              No rows returned.
            </h2>
          )}
        </>
      )}
    </div>
  );
}