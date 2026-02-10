import React from 'react'

const Query = ({question,argument,solution}) => {
console.log(question);
  return (
            
            <div className="question text-white flex-row items-center justify-center p-4 border-2 ">
              <div className="bg-gray-900 w-full">{question}
                </div>
              <div className="w-[500px] h-screen">
                <textarea type="text" className="bg-blue-900 w-full" placeholder='Enter Query'></textarea>
              </div>
           

      
         
      </div>
    
  )
}

export default Query
