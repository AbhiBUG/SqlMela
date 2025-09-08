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
    <div className="h-screen w-full bg-white ">
      {/* ✅ Desktop Split View */}
      <div className="hidden md:block h-full">
        <Split
          className="flex h-full"
          sizes={[55, 45]}
          minSize={320}
          gutterSize={10}
          gutterAlign="center"
          dragInterval={1}
          cursor="col-resize"
          gutter={() => {
            const gutter = document.createElement("div");
            gutter.className =
              "bg-gray-300 hover:bg-primary transition-colors rounded-md w-[6px] mx-auto cursor-col-resize";
            return gutter;
          }}
        >
          {/* Left Panel */}
          <div className="p-4 flex flex-col h-full gap-4 overflow-hidden bg-white">
            {/* Query Section */}
            <div className="flex-1 bg-base-100 rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <h2 className="sticky top-0 bg-base-100 p-3 font-semibold text-lg border-b">
                Results
              </h2>
              <div className="overflow-y-auto flex-1 p-3">
                <QueryResult tableName={tableName} />
              </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 bg-base-100 rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <h2 className="sticky top-0 bg-base-100 p-3 font-semibold text-lg border-b">
                Table : {tableName}
              </h2>
              <div className="overflow-y-auto flex-1 p-3">
                <TableWindow tableName={tableName} />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="h-full overflow-hidden  bg-white">
            <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
              {/* <div className="flex flex-row items-center justify-between px-5">
                        <div className="flex flex-row items-center">
                        <IoIosArrowDown />
                        <h2 className="sticky top-0 bg-base-100 p-3 font-semibold text-black border-b">
                          Exercises
                        </h2>
                        </div>
                        <div className="flex flex-row items-center">
                        <FaPlay />
                        <RiRefreshLine />
                        <button className="text-white bg-black rounded-xl px-3">
                          Next
                          </button>
                        </div>
              </div> */}
              <div className="overflow-y-auto p-3 bg-white">
                <GamePanel tableName={tableName} />
              </div>
            </div>
          </div>
        </Split>
      </div>

      {/* ✅ Mobile stacked layout */}
      <div className="md:hidden flex flex-col h-full p-3 gap-3">
        <details open className="flex-1 bg-base-100 rounded-2xl shadow-lg overflow-hidden">
          <summary className="p-3 font-semibold text-lg cursor-pointer bg-base-200 border-b rounded-t-2xl">
            Query & Table
          </summary>
          <div className="overflow-y-auto max-h-[50vh] p-3">
            <QueryResult tableName={tableName} />
            <TableWindow tableName={tableName} />
          </div>
        </details>

        <details open className="flex-1 bg-base-100 rounded-2xl shadow-lg overflow-hidden">
          <summary className="p-3 font-semibold cursor-pointer bg-base-200 border-b rounded-t-2xl">
            Exercises
          </summary>
          <div className="overflow-y-auto max-h-[50vh]">
            <GamePanel tableName={tableName} />
          </div>
        </details>
      </div>
    </div>
  );
}
