import React,{useState} from "react";
import Arrangement from "../../games/arrangement";


export default function GamePanel({ games }) {
  const isCorrect =()=>{
    
  }  
  return (
    <>
    <div className="border rounded-xl p-4 shadow bg-white h-screen flex flex-col items-center overflow-y-auto">
      <h2 className="font-bold text-lg ">Games</h2>
      <div className="h-[400px] w-[400px] border-2 border-black ">
          <Arrangement arr={[4,3, 2, 1]} sol={"1234"} />
      </div>
      <button className="border-2 bg-blue-400" onClick={isCorrect()} >Submit</button>
    </div>
    </>
  );
}
