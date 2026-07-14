import React from 'react'
import {useNavigate,Link} from 'react-router-dom'
import DB from "../../assets/DB.png";
import { AiFillDatabase } from "react-icons/ai";
import BG from "../../assets/mela1.png";
const Databases = () => {


const Databases = [
  "School",
  "Office",
  "Library",
  "Hospital"

];

const navigate = useNavigate();
  return (
    <div>
       
        <div className="grid grid-cols-3 items-center justify-center p-6 shadow-xl gap-3 h-screen" style={{ backgroundImage: `url(${BG})` }}>
            {Databases.map((database,key)=>(
              <div className="flex flex-col items-center justify-center border-2 shadow-md text-xl font-bold bg-white/50 hover:bg-orange-400/50 hover:text-white cursor-pointer rounded-xl h-[200px] w-[300px] "
              key = {key}
             
               onClick={() => navigate(`/home/${database.toLowerCase()+"db"}`)}
              >
                {/* <img src={DB} className="h-[120px]" alt="DB Logo" /> */}
                <AiFillDatabase className="size-[80px]"/>
                {database}

              </div>
            ))}
        </div>
    </div>
  )
}

export default Databases
