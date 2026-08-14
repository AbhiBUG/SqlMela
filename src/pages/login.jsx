import { React, useState, useEffect } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import DB from "../assets/DB.png";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const Login = ({ setUser }) => {
  const [state, setState] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const togglePassword = () => setState(!state);


  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // console.log(username,password);
      const res = await fetch("https://sqlmela.onrender.com/login", {
        method: "POST",
         credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok){
        if(data.maintenance)
        {
          navigate("/error");
        }
        else{
        setUser(data.user);
        navigate("/home");
        }
      } else {  
           setIsModalOpen(true);
       
        // alert("Invalid Credentials");
          
      }
      }
     catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex flex-col items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2 p-5 shadow-xl"
            >
              <div className="flex flex-col gap-1">
                select
                <input
                  type="text"
                  className="rounded-xl border-2 border-black p-1"
                  value={username}
                  placeholder="username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                from Users <br />
                where password ==
                <div className="flex flex-row bg-white items-center p-1 space-x-1 rounded-xl border-5 border-black border-2">
                  <input
                    type={state ? "text" : "password"}
                    required
                    placeholder="password"
                    className="border-r-2 border-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {state ? (
                    <LuEye onClick={togglePassword} />
                  ) : (
                    <LuEyeClosed onClick={togglePassword} />
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-orange-100 rounded-xl border-2 border-orange-600 text-white bg-orange-500"
                >
                  execute query
                </button>
              </div>
            </form>

            <img src={DB} className="h-[120px]" alt="DB Logo" />
          </div>
        </div>
      </div>
      <Modal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  title="Invalid Credentials"
>
  Username or password is incorrect.
</Modal>
    </>
  );
};

export default Login;
