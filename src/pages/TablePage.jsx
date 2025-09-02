import React from "react";
import Split from "react-split";

import { useParams } from "react-router-dom";
import GamePanel from "../components/InnerPanels/GamePanel";
import QueryResult from "../components/InnerPanels/QueryResult";
import TableWindow from "../components/InnerPanels/TableWindow";
import games from "../data/games.json";

export default function TablePage() {
  const { dbName, tableName } = useParams();

  const tableGames = games.filter((g) => g.table === tableName);

  return (
    <div className="grid grid-cols-2 gap-4 p-6 h-screen bg-orange-100">
      <div className="col-span-1  ">
        <QueryResult tableName={tableName} />
        <TableWindow tableName={tableName} />
        
      </div>
     
      <div className="col-span-1">
        <GamePanel games={tableGames} />
      </div>
    </div>
  );
}
