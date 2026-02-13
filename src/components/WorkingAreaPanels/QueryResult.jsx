import React, { useState, useEffect } from "react";

export default function QueryResult({ tableName, queryResult }) {
  //queryResult is return of the parser
  const [result, setResult] = useState([]);

  const fetchData = async (query) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/query/${tableName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      const data = await res.json();
      console.log("Fetched Data:", data);
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!queryResult) return;

    const d = queryResult;

    if (d.results[0].result.valid) {
      const query = d.results[0].statement; // CORRECT FIELD
      fetchData(query);
    }

  }, [queryResult]); //Runs only when queryResult changes

  if (!queryResult) {
    return (
      <div className="border rounded-2xl shadow bg-white p-4 flex flex-col h-full">
        <p className="text-gray-500 italic">No Results</p>
      </div>
    );
  }

  if (!queryResult.results[0].result.valid) {
    return (
      <h2 className="text-red-600 font-bold">
        Invalid SQL Syntax
      </h2>
    );
  }

  return (
    <div>
      <h2 className="text-orange-400 font-bold">
        Valid Syntax!
      </h2>

      {result.length > 0 ? (
        <>
        <h2 className="text-orange-400 font-bold">Query Executed Successfully!</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              {Object.keys(result[0]).map((col) => (
                <th key={col} className="border px-3 py-2">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className="border px-3 py-2">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </>
      ):
      <h2 className="text-yellow-400 font-bold">
        Query cannot be executed on current table.
      </h2>
      }
    </div>
  );
}
