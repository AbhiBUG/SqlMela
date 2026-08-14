import React from "react";
import Split from "react-split";
import { useParams } from "react-router-dom";
import InteractionWindow from "../components/WorkingAreaPanels/InteractionWindow";
import ResultWindow from "../components/WorkingAreaPanels/ResultWindow";
import TableWindow from "../components/WorkingAreaPanels/TableWindow";
// import games from "../data/games.json";
import { useState } from "react";

export default function TablePage() {
  const { tableName } = useParams();
  // const tableGames = games.filter((g) => g.table === tableName);
   const [validatorResult, setValidatorResult] = useState(
   null);

  return (
    <div className="h-screen w-full">
      {/*  Desktop Split View */}
      <div className="hidden md:block h-full">
        <Split
          className="flex h-full "
          sizes={[55, 45]}
          minSize={320}
          gutterSize={2}
          gutterAlign="center"
          dragInterval={1}
          cursor="col-resize"
          gutter={() => {
            const gutter = document.createElement("div");
            gutter.className =
              "bg-gray-300 hover:bg-white transition-colors  w-[6px] mx-auto cursor-col-resize";
            return gutter;
          }}
        >
          {/* Left Panel */}
          <div className=" flex flex-col h-full  overflow-hidden bg-primary/50">
            {/* Query Section */}
            <div className="flex-1 bg-base-100  shadow-lg overflow-hidden flex flex-col h-full ">
              <h2 className="sticky text-white  bg-base top-0 p-1 font-semibold text-lg border-b text-[10px] px-2">
                Results
              </h2>
              <div className="overflow-y-auto flex-1 p-2 px-2 border-b-[10px]">
                
                <ResultWindow tableName={tableName} 
                validatorResult={validatorResult}
          />
              </div>
            </div>

            {/* Table Section */}
            <div className="flex-1  shadow-lg overflow-hidden flex flex-col">
              <h2 className="sticky top-0 bg-base-100 p-1 font-semibold text-lg border-b bg-base text-surface text-[10px]">
                Table : {tableName}
              </h2>
              <div className="overflow-y-auto flex-1 p-3">
                <TableWindow tableName={tableName} />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="h-full overflow-hidden  bg-primary/50">
            <div className=" shadow-lg overflow-hidden flex flex-col h-full">

              <div className="overflow-y-auto ">
                <InteractionWindow tableName={tableName} 
       
                setValidatorResult={setValidatorResult}/>
              </div>
            </div>
          </div>
        </Split>
      </div>
  
    </div>
  );
}
