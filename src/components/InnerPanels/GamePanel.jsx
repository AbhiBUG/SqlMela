import React,{useState,useEffect} from "react";
import Arrangement from "../../games/Arrangement";
// import games from "../../data/Tables/students/data.json";
import * as GameComponents from "../../games";  //public used
import {FaPlay} from 'react-icons/fa'
import {RiRefreshLine} from 'react-icons/ri'
import {IoIosArrowDown} from 'react-icons/io'

export default function GamePanel({ tableName }) {
  
  const [games, setGames] = useState([]); 
  
  const [currentno,setCurrentno] = useState(0);

  // const isCorrect =()=>{
  //   const checkAnswer = () => {
  //   if (JSON.stringify(items) === JSON.stringify(sol)) {
  //     alert("✅ Correct Arrangement!");
  //   } else {
  //     alert("❌ Wrong Arrangement, try again.");
  //   }
  // };
  // }  




 // Fetch JSON dynamically based on tableName
  useEffect(() => {
    if (!tableName) return;

    fetch(`/data/Tables/${tableName}/data.json`) // ✅ keep data in public/data/Tables/
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load JSON");
        return res.json();
      })
      .then((data) => {
        setGames(data);
        setCurrentno(0); // reset to first question when table changes
      })
      .catch((err) => console.error(err));
  }, [tableName]);

  if (games.length === 0) {
    return <p className="text-white">Loading game data...</p>;
  }



  // Get current game
  const currentGame = games[currentno];
    console.log(tableName);


    const handleplay = () =>
    {
        <QueryResult />
      
    }


  return (
    <>
    <div className="border shadow bg-gray-900 h-screen flex flex-col items-center overflow-y-auto overflow-hidden">
     
<div className="flex flex-row items-center justify-between px-5 bg-white w-full">
                        <div className="flex flex-row items-center">
                        <IoIosArrowDown />
                        <h2 className="sticky top-0 bg-base-100 p-3 font-semibold text-black">
                          Exercises
                        </h2>
                        </div>
                        <div className="flex flex-row items-center space-x-3">
                      
                        <button className="text-white bg-black rounded-xl px-3" onClick={() => setCurrentno((prev) => Math.max(prev - 1, 0))}>
                          prev
                          </button>
                            <FaPlay onClick={handleplay} className="cursor-pointer"/>
                        <RiRefreshLine />
                        <button className="text-white bg-black rounded-xl px-3"  onClick={() =>
    setCurrentno((prev) => Math.min(prev + 1, games.length - 1))
  } >
                          Next
                          </button>
                          {}
                        </div>
              </div>

     <div className="border p-4 shadow bg-gray-900 h-screen flex flex-col items-center overflow-y-auto overflow-hidden text-white w-full">
  {(() => {
    const g = games[currentno];
    const Game = GameComponents[g.game]; 
    return (
      <div className="">
        {Game ? (
          <Game
            key={g.qn} // 👈 use qn as key so React re-renders on change
            argument={g.arguments}
            solution={g.solution}
          />
        ) : (
          <p>Backend error for {g.game}</p>
        )}
      </div>
    );
  })()}
</div>

      
    </div>
    </>
  );
}
