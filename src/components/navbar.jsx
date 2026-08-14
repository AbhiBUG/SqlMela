import React, { useState, useRef, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const NavBar = ({ user, handleLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const displayName = typeof user === "string" ? user : user?.username || "";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const navigate = useNavigate();

const Logout = ()=>{
  handleLogout();
  // localStorage.clear();
  navigate('/');
}

  return (
    <nav
      className="fixed top-0 left-0 w-full flex items-center justify-between 
      px-6 py-1 bg-white  shadow-md z-50"
    >
      {/* Left: Brand / Logo */}
      <div className="flex items-center space-x-2">
        {/* <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-sm">
          DB
        </div> */}
        <span className="font-bold text-lg text-gray-800">SQL Mela</span>
      </div>

      {/* Right: User Info + Dropdown */}
      <div className="relative flex items-center space-x-3" ref={dropdownRef}>
        {/* Username badge (hidden on small screens) */}
        <span className="hidden sm:inline  py-1   font-bold text-sm shadow-sm hover:border-orange-500 hover:text-orange-500">
          {displayName}
        </span>

        {/* User Icon */}
        <AiOutlineUser
          onClick={() => setOpen(!open)}
          className="size-9 p-1.5 border border-base rounded-full cursor-pointer 
          hover:border-orange-500 hover:text-orange-500 transition duration-300 shadow-sm"
        />

        {/* Dropdown Menu */}
        {open && (
          <div
            className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-200 animate-fadeIn z-50"
          >
            <ul className="py-2">
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition" onClick={()=>navigate('/profile')}>
                <FiUser className="text-gray-600" /> Profile
              </li>
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition">
                <FiSettings className="text-gray-600" /> Settings
              </li>
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer transition" onClick={()=>Logout()}>
                <FiLogOut/> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
