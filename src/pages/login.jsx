import { React, useState } from 'react'
import { LuEye,LuEyeClosed } from "react-icons/lu";
import DB from '../assets/DB.png'

import {useNavigate} from 'react-router-dom'
const Login = ({setName}) => {
    
      const [state, setState] = useState(false);
    //   const [message, setMessage] = useState("");
      const [username,setUsername] = useState("");
     const [password,setPassword] = useState("");
        const navigate = useNavigate();
  const set = () => {
    setState(!state);
  }

  function setValues(Uname,pass) {
    setUsername(Uname);
    setPassword(pass);
    
  }

  console.log(username);
  console.log(password);


    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login Successfull");
        setName(username);
        navigate('/home');
      } else {
        alert("Invalid Credentials");
      }
      console.log(message);
    } catch (err) {
      console.log(err);
    }
  };

    
  return (
    <>
    <div>
        
      <div className="flex flex-col items-center justify-center  h-screen">
          <div className="flex flex-col items-center justify-center">

            <form  onSubmit={handleSubmit} className=" bg-white rounded-xl p-5 shadow-xl">
              <div className="flex flex-col gap-1">
                select
                        <input type="text" 
                        className='rounded-xl border-2 border-black p-1' 
                        value={username} 
                        placeholder="username"
                        onChange={(e)=>setUsername(e.target.value)}
                        required></input>from Users <br />
                where password==
                        <div className="flex flex-row bg-white items-center p-1 space-x-1 rounded-xl border-5 border-black border-2">
                            <input type={state?("text"):("password")} 
                            required 
                            placeholder="password"
                            className="border-r-2 border-black" 
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            ></input>{state ? (<LuEye onClick={() => set()} />) : (<LuEyeClosed onClick={() => set()} />)}
                        </div>
                <button type="submit"  className=" rounded-xl border-2 border-orange-600 text-white bg-orange-500 hover:bg-blue-200 active:bg-blue-400">execute query</button>
              </div>
            </form>

            <img src={DB} className="h-[120px] "></img>
            {/* {message && <p className="mt-3 text-center">{message}</p>} */}
            
          </div>

        </div>
    </div>
    </>
  )
}

export default Login
