import React from "react";
import { Link, useParams } from "react-router-dom";
import tables from "../data/tables.json";

export default function Tables() {
  const { dbName } = useParams();
  const filteredTables = tables.filter((t) => t.db === dbName);

  return (
    <div className="p-6  justify-center pt-[50px] h-screen bg-white ">
      <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center">
        {dbName}
      </h1>

      <ul className="mt-6 flex flex-wrap justify-center gap-4 w-full max-w-5xl bg-white">
        {filteredTables.map((t, index) => (
          <li key={t.name}>
            <Link to={`/home/${dbName}/${t.name}`} key={index}>
              {/* <div className="bg-white flex flex-row items-center justify-center shadow-xl py-4 m-5
                              hover:bg-orange-400 hover:text-white active:bg-blue-400 transition duration-200 
                              text-lg sm:text-xl md:text-2xl font-bold text-orange-400 w-[140px] sm:w-[180px] md:w-[220px] text-center">
                {t.name.toUpperCase()}

              </div> */}
              <div className="flex flex-col bg-white shadow-xl p-4">
                <div className="bg-white flex flex-row items-center justify-center shadow-xl py-4 m-5
                              hover:bg-orange-400 hover:text-white active:bg-blue-400 transition duration-200 
                              text-lg sm:text-xl md:text-2xl font-bold text-orange-400 w-[140px] sm:w-[180px] md:w-[220px] text-center">
                    {t.name.toUpperCase()}
                </div>
                <div>
                  Progress %<br></br>
                  Exercises Completed :
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
