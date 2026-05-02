import { useState, useEffect } from "react";
import "./App.css";

import Login from "./Login";
import Register from "./Register";
import Tasks from "./Tasks";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("dashboard");

  // 🔄 Login / Register toggle
  const [isRegister, setIsRegister] = useState(false);

  // 🔥 Sidebar
  const [collapsed, setCollapsed] = useState(false);
  const [taskCount, setTaskCount] = useState(0);

  // 🌙 Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  // 🔓 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // 🔑 Load token
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  return (
    <div>
      {!token ? (
        <>
          {/* 🔐 AUTH SCREEN */}
          {isRegister ? (
            <Register setToken={setToken} />
          ) : (
            <Login setToken={setToken} />
          )}

          {/* 🔁 Toggle Button */}
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button onClick={() => setIsRegister(!isRegister)}>
              {isRegister
                ? "Already have account? Login"
                : "New user? Register"}
            </button>
          </div>
        </>
      ) : (
        <div className={`layout ${darkMode ? "dark" : ""}`}>
          
          {/* 🔥 SIDEBAR */}
          <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            
            {/* Toggle Sidebar */}
            <button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? "➡" : "⬅"}
            </button>

            <h2>🚀 Task App</h2>

            {/* 🌙 Dark Mode */}
            <button onClick={() => setDarkMode(!darkMode)}>
              🌙 <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Dashboard */}
            <button
              className={page === "dashboard" ? "active" : ""}
              onClick={() => setPage("dashboard")}
            >
              📊 <span>Dashboard</span>
            </button>

            {/* Tasks */}
            <button
              className={page === "tasks" ? "active" : ""}
              onClick={() => setPage("tasks")}
            >
              📝 <span>Tasks ({taskCount})</span>
            </button>

            {/* Logout */}
            <button className="logout-btn" onClick={handleLogout}>
              🔓 <span>Logout</span>
            </button>
          </div>

          {/* 🔥 MAIN CONTENT */}
          <div className="main">
            {page === "dashboard" && <Dashboard />}
            {page === "tasks" && (
              <Tasks setTaskCount={setTaskCount} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;