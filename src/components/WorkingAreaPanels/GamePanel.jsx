import React,{useState,useEffect} from "react";
import Arrangement from "../../games/Arrangement";
// import games from "../../data/Tables/students/data.json";
import * as GameComponents from "../../games";  //public used
import {FaPlay} from 'react-icons/fa'
import {RiRefreshLine} from 'react-icons/ri'
import {IoIosArrowDown} from 'react-icons/io'
import Modal from "../Modal";


export default function GamePanel({ tableName,setQueryResult }) {
  const [questions, getQuestion] = useState([]); //entire data set
  const [currentno,setCurrentno] = useState(0); //currentno of data set

  //Modal
  const [score, setScore] = useState(0);  //to be passed in modal
   const [buttonState, setButtonState] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

 // Fetch JSON dynamically based on tableName
  useEffect(() => {
    if (!tableName) return;

    fetch(`/data/Tables/${tableName}/data.json`) // ✅ keep data in public/data/Tables/
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load JSON");
        return res.json();
      })
      .then((data) => {
        getQuestion(data);
        setCurrentno(0); // reset to first question when table changes
      })
      .catch((err) => console.error(err));
  }, [tableName]);

  const [result,setResult] = useState(null);
 
useEffect(() => {
  if (result) {
    setQueryResult({ ...result }); // force new reference
  }
}, [result, setQueryResult]);

  


// console.log("GamePanel queryResult:", result);

  // Get current game
  const currentGame = questions[currentno];


useEffect(() => {
  if (questions.length === 0) return; // safely ignore until questions are loaded
  if (buttonState === 1 && currentGame.game !== "Query") {
    setIsModalOpen(true);
  }
}, [buttonState, currentGame, questions]);




  const handleCloseModal = () => {
    setIsModalOpen(false);
    setButtonState(0); 
    setScore(0);  
  };


const handleplay = () => {
   setButtonState(prev => prev + 1);
  console.log("Button Clicked");
  console.log("Result : "+JSON.stringify(result));
};

if (questions.length === 0) {
    return <p className="text-white">Loading game data...</p>;
  }
  return (
    <>
    <div className="border shadow bg-gray-900 h-screen flex flex-col items-center overflow-y-auto overflow-hidden">
     
<div className="flex flex-row items-center justify-between px-5 bg-gray-800 text-white w-full">
                        <div className="flex flex-row items-center">
                        <IoIosArrowDown />
                        <h2 className="sticky top-0 bg-base-100 p-3 font-semibold">
                          Exercises
                        </h2>
                        </div>
                        <div className="flex flex-row items-center space-x-3">
                      
                        <button className="text-white bg-black rounded-xl px-3" onClick={() => setCurrentno((prev) => Math.max(prev - 1, 0))}>
                          prev
                          </button>
                            <FaPlay onClick={()=>handleplay()} className="cursor-pointer" />
                        <RiRefreshLine />
                        <button className="text-white bg-black rounded-xl px-3"  onClick={() =>
    setCurrentno((prev) => Math.min(prev + 1, questions.length - 1))
  } >
                          Next
                          </button>
                          {}
                        </div>
              </div>

     <div className="border p-4 shadow bg-white h-screen flex flex-col items-center overflow-y-auto overflow-hidden text-white w-full">
  {(() => {
    // const question = questions[currentno]; //current question
    const question = questions[currentno];
    const Game = GameComponents[question.game]; 
    // console.log(Game);
    return (
      <div className="">
        {Game ? (
          <Game
            key={question.qn}
            question={question.question}
            argument={question.arguments}
            solution={question.solution}
            setScore={setScore}
            buttonState={buttonState}
            setResult={setResult}
          />
        )  : (
          <p>Backend error for {question.game}</p>
        )}
      </div>
    );
  })()}
</div>


     {buttonState > 0 && currentGame.game !== "Query" &&
            <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Your Score"
          >
            <p className="text-[70px] font-bold border-t-4 border-white mt-4 pt-4 text-center">
              {score}/{currentGame.solution.length}
            </p>
          </Modal>
     } 


    </div>
    </>
  );
}
