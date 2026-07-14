import React, { useState } from "react";
import { useEffect } from "react";
const Query = ({ question,argument,solution,setScore,playButton,setResult }) => {
  const [sql, setSql] = useState("");
  // const [result, setResult] = useState(null);
  // console.log(sql);
  const validateSQL = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/validate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: sql,
          dialect: "ansi",
        }),
      });

      const data = await response.json();
      setResult(data);
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

  //   useEffect(() => {
  //   if (result) {
  //     setResult(result);
  //   }
  // }, [result]);

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


{/* 
      {result && (
        <div className="mt-4 bg-gray-800 p-3 w-full">
          <pre>{JSON.stringify(result, null, 2)}</pre>
          
        </div>
      )} */}
    </div>
  );
};

export default Query;
