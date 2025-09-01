import React from 'react'
import { AiOutlineUser } from "react-icons/ai";

const NavBar = ({user}) => {
  return (
    <>
    <div className="fixed top-0 left-0 w-full flex flex-row items-center justify-end p-3 bg-base-500 border-b border-base-300 shadow-xl z-50 bg-white">
        <div className="flex flex-row items-center justify-end space-x-2">
        <p className="font-bold text-orange-600">{user}</p>
        <AiOutlineUser className="shadow-xl rounded-xl size-6 p-1 border-2 border-black cursor-pointer"/>
        </div>
    </div>
    </>
  )
}

export default NavBar
