import React from "react";

export default function GamePanel({ games }) {
  return (
    <div className="border rounded-xl p-4 shadow bg-orange-200">
      <h2 className="font-bold text-lg">Games</h2>
      {games.length === 0 ? (
        <p className="text-gray-500">No games available for this table.</p>
      ) : (
        <ul className="mt-2">
          {games.map((g) => (
            <li key={g.id} className="mb-2">
              <strong>{g.title}</strong> — {g.type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
