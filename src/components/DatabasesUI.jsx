import React from 'react'
import {useNavigate,Link} from 'react-router-dom'
const Databases = () => {

// const databaseNames = [
//   "students",
//   "teachers",
//   "classes",
//   "subjects",
//   "exams",
//   "results",
//   "attendance",
//   "assignments",
//   "books",
//   "library",
//   "authors",
//   "publishers",
//   "courses",
//   "departments",
//   "employees",
//   "salaries",
//   "payroll",
//   "projects",
//   "tasks",
//   "trainings",
//   "parents",
//   "guardians",
//   "fees",
//   "payments",
//   "hostel",
//   "rooms",
//   "transport",
//   "buses",
//   "drivers",
//   "staff"
// ];

const Databases = [
  "School",
  "Office",
  "Library",
  "Hospital"

];

const navigate = useNavigate();
  return (
    <div>
        {/* <div className="grid grid-cols-3 gap-4 p-6 border-2 shadow-xl"> */}
        <div className="flex flex-col items-center justify-center p-6 shadow-xl gap-3">
            {Databases.map((database,key)=>(
              <div className="flex flex-col items-center justify-center shadow-xl text-xl font-bold bg-orange-50 hover:bg-orange-400 hover:text-white cursor-pointer rounded-xl h-[100px] w-[300px] active:bg-blue-400"
              key = {key}
             
               onClick={() => navigate(`/home/${database.toLowerCase()+"db"}`)}
              >
                
                {database}
              </div>
            ))}
        </div>
    </div>
  )
}

export default Databases
