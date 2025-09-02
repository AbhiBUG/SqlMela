import React, { useEffect, useState } from "react";

export default function TableWindow({ tableName }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tableName) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/table/${tableName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch table data");
        return res.json();
      })
      .then((data) => setRows(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tableName]);

  return (
    <div className="border rounded-xl p-4 shadow bg-white">
      <h2 className="font-bold text-lg mb-4">Table: {tableName}</h2>

      {loading && <p>Loading table data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && rows.length > 0 && (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {Object.keys(rows[0]).map((col) => (
                <th key={col} className="border border-gray-300 px-4 py-2 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {Object.values(row).map((val, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && rows.length === 0 && <p>No data available.</p>}
    </div>
  );
}
