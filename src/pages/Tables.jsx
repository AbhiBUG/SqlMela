import React from "react";
import { Link, useParams } from "react-router-dom";
import tables from "../data/tables.json";

export default function Tables() {
  const { dbName } = useParams();
  const filteredTables = tables.filter((t) => t.db === dbName);

  return (
    <div className="justify-center pt-[50px] h-screen p-5">
      <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center text-white">
        {dbName.toUpperCase().replace('DB','')}
      </h1>

      <ul className="mt-6 flex flex-row justify-center items-center gap-4 w-full ">
        {filteredTables.map((t, index) => (
          <li key={t.name} className="w-full px-5">
            <Link to={`/home/${dbName}/${t.name}`} key={index}>
              <div className="flex flex-col text-white shadow-xl p-4  bg-primary/50 rounded-md ">
                <div className="text-orange-500 flex flex-row items-center justify-center shadow-xl py-4 m-5 border border-2 bg-white font-bold rounded-md
                             ">
                    {t.name.toUpperCase()}
                </div>
                <div className="text-accent font-bold text-[20px] flex flex-col gap-2">
                  <p>Progress %</p>
                  <div className="w-full h-[20px] border-2 rounded-3xl bg-white"></div>
                  <p>Exercises Completed :</p>
                  <div className="w-full h-[20px] border-2 rounded-3xl bg-white"></div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
