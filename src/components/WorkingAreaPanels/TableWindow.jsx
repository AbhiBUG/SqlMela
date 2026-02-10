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
    <div className="border p-4 shadow bg-black rounded-xl overflow-y-auto">
     

      {loading && <p className="text-gray-300">Loading table data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-lg border border-gray-700">
          <table className="table-auto w-full border-collapse text-sm sm:text-base">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {Object.keys(rows[0]).map((col) => (
                  <th
                    key={col}
                    className="border border-gray-600 px-4 py-2 text-left text-white font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                    } hover:bg-gray-700 transition`}
                >
                  {Object.values(row).map((val, i) => (
                    <td
                      key={i}
                      className="border border-gray-600 px-4 py-2 text-gray-200 break-words max-w-[250px]"
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="text-gray-300">No data available.</p>
      )}
    </div>
  );
}
