import React,{useState,useEffect} from "react";
import Arrangement from "../../games/Arrangement";
// import games from "../../data/Tables/students/data.json";
import * as GameComponents from "../../games";  //public used
import {FaPlay} from 'react-icons/fa'
import {RiRefreshLine} from 'react-icons/ri'
import {IoIosArrowDown} from 'react-icons/io'
import Modal from "../Modal";


export default function GamePanel({ tableName,setValidatorResult }) {

//imp for dataset
  const [questions, getQuestion] = useState([]); //entire data set
  const [currentno,setCurrentno] = useState(0); //currentno of data set


   const [playButton, setplayButton] = useState(0); //Play Button
     const [refresh, setRefresh] = useState(false); //refresh Button
  const [isModalOpen, setIsModalOpen] = useState(false); //modal

  const [queryresult,setQueryResult] = useState(null);
  const [score, setScore] = useState(0);  //to be passed in modal
 // Fetch JSON dynamically based on tableName
  useEffect(() => {
    if (!tableName) return;
    fetch(`/data/Tables/${tableName}/data.json`) 
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

 
useEffect(() => {
  if (queryresult) {
    setQueryResult({ ...queryresult });
  }
}, [queryresult, setQueryResult]);

  const currentGame = questions[currentno];
const [questionsList,openQuestionsList] = useState(false);

useEffect(() => {
  if (questions.length === 0) return; // safely ignore until questions are loaded
  if (playButton === 1 && currentGame.game !== "Query") {
    setIsModalOpen(true);
  }
}, [playButton, currentGame, questions]);




  const handleCloseModal = () => {
    setIsModalOpen(false);
    setplayButton(0); 
    setScore(0);  
  };

const handleNext = () => {
    setCurrentno((prev) => Math.min(prev + 1, questions.length - 1));
    setValidatorResult(null); 
    setplayButton(0); 
    setScore(0);
  
}

const handlePrevious = () =>{
   setCurrentno((prev) => Math.max(prev - 1, 0));
                          
  setQueryResult(null); 
    setplayButton(0); 
    setScore(0); 
  
}

  const validateQueryResult = () => {
  if (!currentGame || !queryresult) return false;

  const expected = currentGame.solution;

  return JSON.stringify(queryresult) === JSON.stringify(expected);
};

const handleplay = () => {
  setplayButton((prev) => prev + 1);

  if (!currentGame) return;

  if (currentGame.game === "Query") {
    const isCorrect = validateQueryResult();
    setScore(isCorrect ? 1 : 0);
    setIsModalOpen(true);
  }

  console.log("Button Clicked");
  console.log("Result : " + JSON.stringify(queryresult));
};



if (questions.length === 0) {
    return <p className="text-white">Loading game data...</p>;
  }



  return (
    <>
    <div className=" shadow h-screen flex flex-col items-center overflow-y-auto overflow-hidden">
     
<div className="flex flex-row items-center justify-between px-5 bg-base text-white w-full">
                        <div className="flex flex-row items-center">
                        <IoIosArrowDown className="hover:cursor-pointer" onClick={()=>openQuestionsList(!questionsList)}/>
                        <h2 className="sticky top-0  p-3 font-semibold">
                          Exercises
                        </h2>
                          { 
                            questionsList && <div className="absolute w-[200px] max-h-[200px] overflow-y-auto grid grid-cols-5 gap-2 bg-primary border border-surface text-black p-2 shadow-md mx-[20px] mt-[150px]">
                             
                               {questions.map((question)=>(
                              
                               <div className="border border-black bg-white w-[30px] h-[30px] flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-black hover:text-white "
                               onClick={()=>setCurrentno(question.qn-1)}>{question.qn}</div>
                               ))
                              }
                              </div>
                          }

                        </div>
                        <div className="flex flex-row items-center space-x-3">
                      
                        <button className="text-white rounded-xl px-3 border" onClick={() => handlePrevious()}>
                          Prev
                          </button>
                            <FaPlay onClick={()=>handleplay()} className="cursor-pointer " />
                        <RiRefreshLine
                          onClick={() => setRefresh((prev) => prev + 1)}
                          className="cursor-pointer"
                        />
                        <button className="text-white rounded-xl px-3 border"  onClick={()=>handleNext() 
  } >
                          Next
                          </button>
                          {}
                        </div>
              </div>

     <div className="border p-4 shadow  h-screen flex flex-col items-center overflow-y-auto overflow-hidden text-white w-full ">
  {(() => {
    const question = questions[currentno];
    const Game = GameComponents[question.game]; 
   
    return (
      <div className="w-full">
        {Game ? (
          <Game
            key={`${question.qn}-${refresh}`}
            question={question.question}
            argument={question.arguments}
            solution={question.solution}
            setScore={setScore}
            playButton={playButton}
            setValidatorResult={setValidatorResult}
          />
        )  : (
          <p>Backend error for {question.game}</p>
        )}
      </div>
    );
  })()}
</div>


     {playButton > 0 && currentGame.game !== "Query" && currentGame.game !== "OutputGuessing" &&
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


          {playButton > 0 && currentGame.game == "OutputGuessing" &&
            <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title=""
          >
         

            {score==1 ?(
            <div className="flex flex-col items-center justify-center">
            <p className="text-[25px] font-bold">Output Guessed Correctly!</p>
              
              <p className="text-[70px] font-bold">1/1</p>
            </div>):(

          <div className="flex flex-col items-center justify-center">
            <p className="text-[25px] font-bold">Invalid Guess!</p>

            </div>
            )
          }
          </Modal>
     } 

    </div>
    </>
  );
}
