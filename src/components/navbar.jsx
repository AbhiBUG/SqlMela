import React from "react";
import { AiOutlineUser } from "react-icons/ai";

const NavBar = ({ user }) => {
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-end px-6 py-3 
      bg-gradient-to-r from-base-200 via-base-100 to-base-200 
      border-b border-base-300 shadow-lg z-50">
      
      <div className="flex items-center space-x-3">
        {/* Username Badge */}
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm shadow-sm">
          {user}
        </span>

        {/* User Icon */}
        <AiOutlineUser 
          className="size-8 p-1.5 border-2 border-gray-400 rounded-full cursor-pointer 
          hover:border-orange-500 hover:text-orange-500 transition duration-300 shadow-md"
        />
      </div>
    </div>
  );
};

export default NavBar;
