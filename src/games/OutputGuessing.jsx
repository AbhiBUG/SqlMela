import React from 'react'
import { useState } from 'react';
import { useEffect } from "react";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaMinusSquare } from 'react-icons/fa';
const OutputGuessing = ({ question, argument, solution,setScore,playButton,setResult}) => {
  
const [table, setTable] = React.useState([
  ["", ""]
]);

const MAX_ROWS = argument[0];
const MAX_COLS = argument[1];

// const [totalRows,changeRows] = useState(0);
// const [totalCols,changeCols] = useState(2);

// const res = await fetch("http://127.0.0.1:8000/validate-output", {
//     query: question
// });

// const actual = res.data;


const [actualTable,setActualTable] = useState(null);

  const validateSQL = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/validate-output", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: question,
          dialect: "ansi",
        }),
      });
 const data = await response.json();
 console.log(data);
 
 const actual = data.map(obj => Object.values(obj)); 
//  console.log(actual); 
setActualTable(()=>actual);    
} catch (error) {
      console.error("Error:", error);
    }

    }

  

function compareTables(userTable, actualTable){
    // console.log("compareTable called");
    if(userTable.length !== actualTable.length)
        return false;

    if(userTable[0].length !== actualTable[0].length)
        return false;

    for(let i=0;i<actualTable.length;i++){

        for(let j=0;j<actualTable[i].length;j++){

            if(String(userTable[i][j]).trim() !==
               String(actualTable[i][j]).trim())
                return false;

        }

    }

    return true;
}


const correct =
  actualTable &&
  compareTables(table, actualTable);

if(correct){
    // console.log("Correct");
    // setResult([1]);
    setScore(1);
}
else{
    // console.log("Not Correct");
    // setResult([]);
    setScore(0);
}






const addRow = () => {
  if (table.length >= MAX_ROWS) 
    return;
  const cols = table[0].length;
  const newRow = new Array(cols).fill("");
    // changeRows(()=>totalRows+1);
  setTable([...table, newRow]);
};

const deleteRow = () => {
  setTable((prevTable) => {
    if (prevTable.length <= 1) return prevTable;
    return prevTable.slice(0, -1);
  });
};

const addCol = () => {
  if (table[0].length >= MAX_COLS) return;
  const newTable = table.map((row) => [...row, ""]);
//   changeCols(()=>totalCols+1);
  setTable(newTable);
};

const deleteColumn = () => {
  if (table[0].length <= 1) return;
  setTable((prevTable) =>
    prevTable.map((row) => row.slice(0, -1))
  );
};

const handleChange = (rowIndex, colIndex, value) => {
  const newTable = [...table];
  newTable[rowIndex][colIndex] = value;
  setTable(newTable);
};


useEffect(() => {
  if (playButton > 0) {
    validateSQL();
  }
}, [playButton]);

    return (
    <div>
      <h1 className="font-bold text-[30px] ">Create the output table of the below query : </h1>
      <div className="flex flex-col border border-muted p-2 h-[300px] bg-base">
            <h1>{question}</h1>
            <div className="structre-expand border border-muted flex ">
                <div className="text-accent border-r flex flex-row items-center justify-center gap-2 px-2 bg-base cursor-pointer"
                >
                    <FaMinusSquare onClick={()=>deleteCol()}></FaMinusSquare>
                    <p>Column</p>
                    <FaRegPlusSquare className="text-accent" onClick={()=>addCol()}/>
                </div>
                <div className=" text-accent border-r flex flex-row items-center justify-center gap-2 px-2 bg-base cursor-pointer"
                >   
                     <FaMinusSquare onClick={()=>deleteRow()}></FaMinusSquare>
                    <p>Row</p>
                    <FaRegPlusSquare className="text-accent" onClick={()=>addRow()}/>
                </div>
            </div>
      <div className="table-container border border-muted w-full h-full bg-primary/50 flex flex-col">
            <div className="h-full border border-muted overflow-y-auto">
                {
                    table.map((row,rowIndex)=>(
                                <div key={rowIndex} className="flex ">
                                    {row.map((cell, colIndex) => (
                                        <input
                                        key={colIndex}
                                        value={cell}
                                        onChange={(e) =>
                                            handleChange(rowIndex, colIndex, e.target.value)
                                        }
                                        className="border border-muted/30 p-2 w-full bg-base"
                                        />
                                    ))}
                                    </div>
                    )
                    )
                }


            </div>
            <div className="flex justify-between px-2">
                {/* <p>Columns : {totalRows}</p>
                <p>Rows : {totalCols}</p> */}
                <p>Columns : {table[0].length} </p>
                <p>Rows : {table.length}</p>
            </div>
        </div>

    </div>
    </div>
  )
}

export default OutputGuessing
