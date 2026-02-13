import React, { useState } from "react";

const Arrangement = ({ question, argument, solution,setScore,buttonState,setResult}) => {

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

  

  return (
    <div className="p-6 mt-3 flex flex-col items-center gap-4 text-white border">
      <h2 className="text-2xl text-black font-bold  font-serif">ARRANGE IN CORRECT ORDER</h2>
                <div className="text-black font-bold">{question}</div>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4  max-w-5xl text-black border-4 border-orange-100 w-full">
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
                      className={` py-4 px-20  text-center shadow-md cursor-move transition-all duration-200 
                        ${dragging === index
                          ? "bg-orange-300 scale-95"
                          : overIndex === index
                            ? "bg-orange-200 border-2 border-orange-500 scale-105"
                            : "bg-orange-400 hover:bg-orange-100"
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
