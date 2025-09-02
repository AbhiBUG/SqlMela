import { React, useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './index.css'
import BG from './assets/bg.jpg'
import NavBar from './components/navbar.jsx'
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";

import Tables from './pages/Tables.jsx'
import TablePage from './pages/TablePage.jsx'
const App = () => {

  const [username, setUsername] = useState("");

  return (
    <>
    
      <NavBar  user={username}/>
      <div>Hello</div> 
      <div style={{ backgroundImage: `url(${BG})` }} className="h-screen bg-cover bg-no-repeat">
        
        <Router>
         <Routes>
            <Route path="/" element={<Login setName={setUsername}/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/home/:dbName/" element={<Tables/>}></Route>
            <Route path="/home/:dbName/:tableName" element={<TablePage />} />
            {/* <Route path="/home/librarydb" element={<LibraryDB/>}></Route>
            <Route path="/home/schooldb" element={<SchoolDB/>}></Route>
            <Route path="/home/officedb" element={<OfficeDB/>}></Route> */}
            </Routes>
        </Router>
      
     
      </div>
    </>
  )
}

export default App
