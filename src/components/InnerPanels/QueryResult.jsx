import React, { useState } from "react";

export default function QueryResult({ tableName }) {
  const [result, setResult] = useState([]);

  // const runQuery = () => {
  //   // Mock result for now
  //   setResult([{ id: 1, name: "John" }, { id: 2, name: "Jane" }]);
  // };

  return (
    <div className="border rounded-xl p-4 shadow bg-white">
      <h2 className="font-bold text-lg ">Query Results</h2>
      {/* <button
        onClick={runQuery}
        className="bg-blue-400 text-white px-3 py-1 rounded mt-2 active:bg-orange-300 hover:bg-blue-600 "
      >
        Run Query
      </button> */}
      <ul className="mt-3">
        {result.map((row, i) => (
          <li key={i}>{JSON.stringify(row)}</li>
        ))}
      </ul>
    </div>
  );
}
