import React from 'react'

const FillContainer = ({question,argument,solution,setScore,buttonState,setResult}) => {
console.log(question);
  return (
    <div className=" w-full h-screen text-black">
            
            <div className="question">{question}</div>
            <div className="flex items-center justify-center gap-4">
            {argument && argument.map((option, key) => (
              <div key={key} className="bg-gray-200 p-2 rounded-lg">{option}</div>
            ))}
              </div>
              <div>{solution}</div>
         
      </div>
    
  )
}

export default FillContainer
