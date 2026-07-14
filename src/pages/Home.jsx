import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tables from '../components/Tabs/Database.jsx';
import Practice from '../components/Tabs/Practice.jsx';
import Tests from '../components/Tabs/Test.jsx';
const Home = () => {
  const [value, setValue] = useState(0);
  const tabs = [
    {
      name:"Databases",
      component:<Tables/>
    },
        {
      name:"Practice",
      component:<Practice/>
    },
        {
      name:"Tests",
      component:<Tests/>
    }
  ]

  return (
    <>
      <div>
        <div className="h-screen mt-[40px]">
          <div className="flex flex-col items-center justify-center bg-white">
            <ul className="flex flex-row items-center justify-start border-2 w-full">
              
              {tabs.map((tab, key) => (
                <li
                  className={` shadow-xl pl-2 pr-2 border-2 text-[20px] font-bold ${value === key ? "bg-white  " : "bg-orange-300 text-white"} cursor-pointer active:bg-white transition-colors`}
                  key={key}
                  onClick={() => setValue(key)}
                >
                  {tab.name}
                </li>
              ))}

            </ul>

            <div className="bg-white w-screen">
                {tabs[value].component} 
            </div>


          </div>
        </div>
      </div>
    </>
  )
}

export default Home
