import {React,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Tables from '../components/DatabasesUI.jsx';
import Practice from '../components/Practice.jsx';
import Tests from '../components/Tests.jsx';
const Home = () => {
  const navigate = useNavigate();
  const tabs = ["Databases","Practice","Tests"];
  const [value,setValue] = useState(0);
  const tabsContent = [<Tables/>,<Practice/>,<Tests/>];

 
  return (
  <>
    <div>
        <div className="h-screen bg-white mt-[40px] pl-10">
                <div className="flex flex-col items-center justify-center">
                    <ul className="flex flex-row items-center justify-start w-screen  ">
                        
                        {tabs.map((tab,key)=>(
                          <li  
                          className={` shadow-xl pl-2 pr-2 ${value === key? "bg-orange-100":"bg-orange-50"} hover:bg-orange-400 cursor-pointer active:bg-blue-400`}
                          key = {key}
                          onClick={() => setValue(key)}
                          >
                            {tab}
              
                            </li>
                        ))}
                       
                    </ul>

                    <div className="bg-orange-100 w-screen">
                          
                            <div>
                            {tabsContent[value]}
                             
                            </div>

                    </div>


                </div>
        </div>
    </div>
    </>
  )
}

export default Home
