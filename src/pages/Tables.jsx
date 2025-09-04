import React from "react";
import { Link, useParams } from "react-router-dom";
import tables from "../data/tables.json";
import { Xwrapper, Xarrow } from "react-xarrows";

export default function Tables() {
  const { dbName } = useParams();
  const filteredTables = tables.filter((t) => t.db === dbName);

  return (
    <div className="p-6 flex flex-col items-center justify-center pt-[50px] ">
      <h1 className="text-xl font-bold text-[50px] ">Tables in {dbName}</h1>
      
      <ul className=" ml-5 mt-4 h-10 flex flex-row ">
        {filteredTables.map((t,index) => (
          
          <li key={t.name} className="">
            <Link
              to={`/home/${dbName}/${t.name}`}
              className="text-orange-400 "
              key={index}
            >            <div className="bg-white flex flex-row p-5 m-3 rounded-lg border-2 border-gray-600 hover:bg-blue-100 active:bg-blue-400 text-xl font-bold">

              {t.name}
               </div>
               
            </Link>
                          {index>filteredTables.length?(<p></p>):(<li className="bg-white flex flex-row p-5 m-3 rounded-lg border-2 border-gray-600 hover:bg-blue-100 active:bg-blue-400 text-xl font-bold">→</li>)}

          </li>
          
          
        ))}
      </ul>
      
    </div>
  );
}
