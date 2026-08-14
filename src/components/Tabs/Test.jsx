import React from 'react'
import M from "../../assets/maintenance.png";
const Tests = () => {
  return (
   <div className="min-h-screen bg-white flex items-center justify-center px-6">
       <div className="max-w-lg text-center">
         <img
           src={M}
           alt="Maintenance"
           className="w-72 mx-auto mb-10"
         />
 
         <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
           Feature Unavailable
         </h1>
 
         <div className="mt-8 text-sm text-gray-500">
           Thank you for your patience.
         </div>
       </div>
     </div>
   );
 };
 

  


export default Tests
