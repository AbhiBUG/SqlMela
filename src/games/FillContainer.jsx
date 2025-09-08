import React from 'react'

const FillContainer = ({argument,solution}) => {
    //   const [items, setItems] = useState(argument);
    console.log(argument);
  return (
    <div className="">
      
            

          
            <div className="flex flex-col border-2  h-screen">
                {argument.map((option,key)=>{
                    return(
                        <div className="bg-white flex flex-row justify-between text-black">
                    <div
                    key={key}

                        className="border-2 text-black"
                    ><h1>{option}</h1> 
                        </div>

                        <div className="border-2 border-black"
                        >
                            {option}
                        </div>
                          </div>

                    )} )}
                    </div>
      </div>
    
  )
}

export default FillContainer
