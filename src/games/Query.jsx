import React, { useState } from "react";
import { useEffect } from "react";
const Query = ({ question,argument,solution,setScore,playButton,setValidatorResult }) => {
  const [sql, setSql] = useState("");
  const validateSQL = async () => {
    try {
      const response = await fetch("https://djangobackend-bc3u.onrender.com/api/validate/", {   //localhost:8000 replaced
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: sql,
          dialect: "ansi",
        }),
      });

      const data = await response.json();
      setValidatorResult(data);
      console.log(data);
       console.log("Game input : "+JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  };

useEffect(() => {
  if (playButton > 0) {
    validateSQL();
  }
}, [playButton]);


  return (
    <div className="question text-white flex flex-col items-center  h-screen">
      
      <div className="bg-gray-900 w-full p-2 border">
        {question}
      </div>

      <div className="w-full border">
        <textarea
          className="bg-blue-900 w-full h-[200px] p-2"
          placeholder="Enter Query"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Query;
