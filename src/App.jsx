import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./index.css";
// import BG from "./assets/bg.jpg";
import BG from "./assets/bg1.png";
import NavBar from "./components/navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import Tables from "./pages/Tables.jsx";
import TablePage from "./pages/WorkingArea.jsx";
import Profile from "./pages/Profile.jsx";
import Maintenance from "./pages/Maintenance.jsx";



const App = () => {
  const [user, setUser] = useState(null);
  const [isDemoUser,setDemoUser] = useState(false);


  const ProtectedRoute = ({ user, children }) => {
    // Not logged in - redirect to login
    if (!user && !isDemoUser) {
      return <Navigate to="/" replace />;
    }
    
    // Demo user - redirect to home (allow only login and home)
    if (isDemoUser) {
      return <Navigate to="/home" replace />;
    }
    
    // Regular user - allow access
    return children;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <NavBar user={user} handleLogout={handleLogout} />

      <div
        style={{ backgroundImage: `url(${BG})` }}
        className="min-h-screen bg-cover bg-no-repeat flex flex-col relative"
      >
        {/* overlay for readability */}
        <div className="absolute "></div>

        <main className="flex-1 pt-10 relative z-10">
          <Routes>
            <Route path="/maintenance" element={<Maintenance></Maintenance>}/>
            <Route path="/" element={<Login setUser={setUser} setDemoUser={setDemoUser} />} />

            <Route
              path="/home"
              element={ 
              <Home />}
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <Profile username={user?.username} />
                 </ProtectedRoute>
              }
            />

            <Route
              path="/home/:dbName"
              element={
                 <ProtectedRoute user={user}>
                  <Tables />
                </ProtectedRoute>
              }
            />

            <Route
              path="/home/:dbName/:tableName"
              element={
                <ProtectedRoute user={user}>
                  <TablePage user={user} setUser={setUser} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />


          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
