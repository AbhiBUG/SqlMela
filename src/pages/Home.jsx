import {React,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Tables from '../components/Tables.jsx';
import Practice from '../components/Practice.jsx';
import Tests from '../components/Tests.jsx';
const Home = () => {
  const navigate = useNavigate();
  const tabs = ["Tables","Practice","Tests"];
  const [value,setValue] = useState(0);
  const tabsContent = [<Tables/>,<Practice/>,<Tests/>];

 
  return (
  <>
    <div>
        <div className="h-screen bg-white mt-[40px]">
                <div className="flex flex-col items-center justify-center">
                    <ul className="flex flex-row items-center justify-start w-screen bg-orange-100">
                        
                        {tabs.map((value,key)=>(
                          <li  
                          className="border-r-2 border-orange-500 pl-2 pr-2 bg-orange-200 active:bg-blue-800 hover:bg-orange-400 cursor-pointer" 
                          key = {key}
                          onClick={()=>setValue(key) }
                          >
                            {value}
              
                            </li>
                        ))}
                       
                    </ul>

                    <div className="bg-orange-50 w-screen h-screen">
                          
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
