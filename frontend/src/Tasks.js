import { useEffect, useState, useCallback } from "react";
import API from "./api";

function Tasks({ setTaskCount }) {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ✅ Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);

      // update sidebar count
      if (setTaskCount) {
        setTaskCount(res.data.length);
      }
    } catch (err) {
      console.log(err);
    }
  }, [setTaskCount]);

  // ✅ FIXED useEffect
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // ✅ important fix

  // ✅ Update status
  const updateStatus = async (id) => {
    try {
      await API.put(`/tasks/${id}`, { status: "completed" });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Create task
  const createTask = async () => {
    if (!title) return alert("Title required");

    try {
      await API.post("/tasks", { title, description });

      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Tasks</h2>

      {/* ➕ Add Task */}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="add-btn" onClick={createTask}>
        Add Task
      </button>

      <hr />

      {/* 📋 Task List */}
      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="card">
            <p><b>{task.title}</b></p>

            <p className={`status ${task.status}`}>
              Status: {task.status}
            </p>

            {/* ✅ Complete */}
            {task.status !== "completed" && (
              <button
                className="complete-btn"
                onClick={() => updateStatus(task._id)}
              >
                Complete
              </button>
            )}

            {/* ❌ Delete */}
            <button
              className="delete-btn"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Tasks;