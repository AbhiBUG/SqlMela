import React from 'react'
import {useNavigate,Link} from 'react-router-dom'
import DB from "../assets/DB.png";
import { AiFillDatabase } from "react-icons/ai";
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
       
        <div className="grid grid-cols-3 items-center justify-center p-6 shadow-xl gap-3 h-screen">
            {Databases.map((database,key)=>(
              <div className="flex flex-col items-center justify-center shadow-xl text-xl font-bold bg-white hover:bg-orange-400 hover:text-white cursor-pointer rounded-xl h-[200px] w-[300px] active:bg-blue-400"
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
