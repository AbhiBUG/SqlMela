import React, { useState } from "react";

export default function QueryResult({ tableName }) {
  const [result, setResult] = useState([]);

  // Example for future backend call
  const runQuery = async () => {
    const res = await fetch(`http://localhost:5000/api/query/${tableName}`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="border rounded-2xl shadow bg-white p-4 flex flex-col h-full">
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {result.length === 0 ? (
          <p className="text-gray-500 italic">No Results</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(result[0]).map((col) => (
                  <th
                    key={col}
                    className="border border-gray-300 px-3 py-2 text-left font-semibold"
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
                  className="odd:bg-white even:bg-gray-50 hover:bg-blue-50"
                >
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      className="border border-gray-300 px-3 py-2 whitespace-nowrap"
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
