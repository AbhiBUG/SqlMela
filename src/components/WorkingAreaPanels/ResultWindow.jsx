import React, { useState, useEffect } from "react";

export default function QueryResult({ tableName, queryResult }) {
  const [result, setResult] = useState([]);

  const fetchData = async (query) => {
    try {
      const res = await fetch(`http://localhost:5000/api/query/${tableName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      console.log("Fetched Data:", data);
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const isValid = queryResult?.results?.[0]?.result?.valid;
    const query = queryResult?.results?.[0]?.statement;

    if (isValid && query) {
      fetchData(query);
    }
  }, [queryResult, tableName]);

  // console.log(queryResult);

  if (!queryResult || !queryResult?.results || queryResult.results.length === 0) {
    return (
      <div className="border shadow bg-primary/50 p-4 flex flex-col h-full">
        <p className="text-gray-500 italic">No Results</p>
      </div>
    );
  }

  const isValid = queryResult?.results?.[0]?.result?.valid;
  const errors = queryResult?.results?.[0]?.result?.errors;

  if (!isValid) {
    return (
      <div className="border shadow bg-primary/50 p-4 flex flex-col h-full">
        <h2 className="text-red-600 font-bold">Invalid SQL Syntax</h2>
        <p>Error: {Array.isArray(errors) ? errors.join(", ") : errors}</p>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-accent font-bold">Valid Syntax!</h2>

      {result.length > 0 ? (
        <>
          <h2 className="text-accent italic font-bold">
            Query Executed Successfully!
          </h2>

          <div className="p-3 overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300 text-[10px]">
              <thead>
                <tr>
                  {Object.keys(result[0]).map((col) => (
                    <th
                      key={col}
                      className="border border-gray-600 px-4 py-2 text-left text-white font-semibold bg-gray-600 border-white"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {result.map((row, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                    } hover:bg-gray-700 transition`}
                  >
                    {Object.values(row).map((val, j) => (
                      <td
                        key={j}
                        className="border border-gray-600 px-4 py-2 text-gray-200 break-words max-w-[250px]"
                      >
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h2 className="text-yellow-400 font-bold">No rows returned.</h2>
      )}
    </div>
  );
}