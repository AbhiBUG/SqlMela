import React,{useState} from 'react'

const Arrangement = ({arr,sol}) => {
  
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (index) => {
    setDragging(index);
  };


  const handleDrop = (index) => {
    if (dragging === null) return;
  }
    
  return (
    <div>
       { console.log(arr)}
        <div className="">
            {  arr.map((option, index)=><button 
            key={index} 
            className="flex p-l items-center justify-center w-full border-2 border-black" 
              draggable  
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
            >
                {option}</button>)}
        </div>
    </div>
  )
}

export default Arrangement
