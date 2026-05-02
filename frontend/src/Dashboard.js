import { useEffect, useState } from "react";
import API from "./api";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  // 🔥 Fetch tasks and calculate stats
  const fetchStats = async () => {
    try {
      const res = await API.get("/tasks");
      const tasks = res.data || [];

      const total = tasks.length;
      const completed = tasks.filter(t => t.status === "completed").length;
      const pending = tasks.filter(t => t.status !== "completed").length;

      // Optional: overdue (if you add dueDate later)
      const overdue = 0;

      setStats({ total, completed, pending, overdue });

    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h2>📊 Dashboard</h2>

      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        
        <div className="card">
          <h3>Total Tasks</h3>
          <p>{stats.total}</p>
        </div>

        <div className="card">
          <h3>✅ Completed</h3>
          <p>{stats.completed}</p>
        </div>

        <div className="card">
          <h3>⏳ Pending</h3>
          <p>{stats.pending}</p>
        </div>

        <div className="card">
          <h3>⚠️ Overdue</h3>
          <p>{stats.overdue}</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;