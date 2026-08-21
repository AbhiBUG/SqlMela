import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tables from '../components/Tabs/Database.jsx';
import Practice from '../components/Tabs/Practice.jsx';
import Tests from '../components/Tabs/Test.jsx';
import C from '../assets/coffee.png'
import BugReporting from '../components/modals/BugReportModal.jsx';
import PaymentModal from '../components/modals/PaymentModal.jsx';
const Home = () => {
  const [value, setValue] = useState(0);
  const [reportModalStatus,changeReportModal] = useState(false);
  const [paymentModalStatus,changePaymentModal] = useState(false);
  const reportError = () =>{
    changeReportModal(!reportModalStatus);

  }
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
          {
            reportModalStatus && <BugReporting changeStatus = {changeReportModal}/>
          }

          {
             paymentModalStatus && <PaymentModal onClose = {changePaymentModal}/>
          }
          <div className="fixed bottom-1 z-40 flex justify-between w-full items-center cursor-pointer px-2">
              <div className="flex flex-col items-center justify-center cursor-pointer" onClick={()=>changePaymentModal(!reportModalStatus)}>
                <img src={C} className="h-[70px]"></img>
                <p>Buy a Cofee</p>
            </div>
            <div className="cursor-pointer" onClick={()=>reportError()}>
              <button className="bg-orange-600 px-5 p-2 text-white rounded-2xl">Report Error</button>
            </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Home
