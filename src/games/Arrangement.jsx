import React, { useState,useEffect } from "react";

const Arrangement = ({ question, argument, solution,setScore,playButton,setResult}) => {

  // console.log(argument);
  // console.log(solution);
  const [items, setItems] = useState(argument);

  const [dragging, setDragging] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const handleDragStart = (index) => {
    setDragging(index);
  };

  const handleDrop = (index) => {
    if (dragging === null || dragging === index) return;

    const updated = [...items];
    const [movedItem] = updated.splice(dragging, 1);
    updated.splice(index, 0, movedItem);

    setItems(updated);
    setDragging(null);
    setOverIndex(null);
  };


  useEffect(()=>{
    if (!playButton) return;
      let score = 0;
      items.forEach((item,index)=>{
        if(solution[index]==item)
        {
          score++;
        }
      })
      setScore(score);
  },[playButton]);

  


  return (
    <div className="p-6 mt-3 flex flex-col items-center gap-4 text-white border ">
      <h2 className="text-2xl text-black font-bold  font-serif">ARRANGE IN CORRECT ORDER</h2>
                <div className="text-black font-bold bg-surface p-4">{question}</div>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1  max-w-5xl text-black border-4 border-orange-100 w-full bg-white/80 rounded font-bold">
                  {items.map((option, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setOverIndex(index);
                      }}
                      onDragLeave={() => setOverIndex(null)}
                      onDrop={() => handleDrop(index)}
                      className={` py-4 px-20  text-center shadow-md cursor-move transition-all duration-200 border-[3px] border-base
                        ${dragging === index
                          ? "bg-primary/50 scale-95"
                          : overIndex === index
                            ? "bg-primary/20 border-2 border-white scale-105"
                            : " hover:bg-surface"
                        }
                      `}
                    >
                      {option}
                    </div>
                  ))}
                </div>
    </div>
  );
};

export default Arrangement;
