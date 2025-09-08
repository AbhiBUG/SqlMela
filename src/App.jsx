import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./index.css";
import BG from "./assets/bg.jpg";
import NavBar from "./components/navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import Tables from "./pages/Tables.jsx";
import TablePage from "./pages/TablePage.jsx";

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/" replace />;
};

const App = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUsername(JSON.parse(storedUser).username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUsername("");
  };

  return (
    <Router>
      <NavBar user={username || "Guest"} onLogout={handleLogout} />

      <div
        style={{ backgroundImage: `url(${BG})` }}
        className="min-h-screen bg-cover bg-no-repeat flex flex-col relative"
      >
        {/* overlay for readability */}
        <div className="absolute "></div>

        <main className="flex-1 pt-16 relative z-10">
          <Routes>
            <Route path="/" element={<Login setName={setUsername} />} />

            <Route
              path="/home"
              element={
                <ProtectedRoute user={username}>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/home/:dbName"
              element={
                <ProtectedRoute user={username}>
                  <Tables />
                </ProtectedRoute>
              }
            />

            <Route
              path="/home/:dbName/:tableName"
              element={
                <ProtectedRoute user={username}>
                  <TablePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
