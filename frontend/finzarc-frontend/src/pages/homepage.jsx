import React, { useState } from "react";
import "./../css/HomePage.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedTaskName, setUpdatedTaskName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); 

  const handleAddTask = async () => {
    if (newTask) {
      try {
        const id = Date.now()
        const res = await fetch("https://finzarc-application.onrender.com/api/add-task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            message: newTask,
            complete: false,
          }),
        });

        const data = await res.json()

        if (data.success) {
          console.log("yes")
          setNewTask("")
        } else {
          console.log("noo")
        }
      } catch (e) {
        console.error(e)
      }
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch("https://finzarc-application.onrender.com/api/delete-task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id }) // only need the ID to delete
      });
  
      const data = await res.json();
  
      if (data.success) {
        setTasks(tasks.filter(task => task.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTask = async (id) => {
    if (updatedTaskName) {
      try {
        const res = await fetch("https://finzarc-application.onrender.com/api/update-task", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            message: updatedTaskName,
            complete: false
          }),
        });

        const data = await res.json()

        if (data.success) {
          setTasks(tasks.map(task =>
            task.id === id ? { ...task, name: updatedTaskName } : task
          ));
          setEditingTaskId(null);
          setUpdatedTaskName("");
        }

      } catch (e) {
        console.error(e)
      }
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleViewTask = async() => {
    try {
      const res = await fetch("https://finzarc-application.onrender.com/api/view-tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()
      console.log(data)
      const updatedTasks = data.map(task => ({
        id: task.id,
        name: task.message,
        completed: task.complete
      }));
      
      setTasks(updatedTasks);
    } catch (e) {

    }
    setShowModal(true)
  }

  return (
    <div className="task-manager-container">
      <button onClick={() => navigate("/")} className="logout-button">Logout</button>
      <h2>Task Manager</h2>

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTask}>Add Task</button>
        <button onClick={handleViewTask} className="view-tasks-button">View Tasks</button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Your Tasks</h3>
            <button className="close-button" onClick={() => setShowModal(false)}>X</button>
            <div className="task-list">
              {tasks.length === 0 ? (
                <p>No tasks yet! Add some.</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="task-item">
                    <p className={`task-name ${task.completed ? "completed" : ""}`}>
                      {task.name}
                    </p>
                    {editingTaskId === task.id ? (
                      <div>
                        <input
                          type="text"
                          value={updatedTaskName}
                          onChange={(e) => setUpdatedTaskName(e.target.value)}
                          placeholder="Update task"
                        />
                        <button onClick={() => handleUpdateTask(task.id)}>Save</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => {
                          setEditingTaskId(task.id);
                          setUpdatedTaskName(task.name);
                        }} className="update-button">Update</button>

                        <button onClick={() => handleDeleteTask(task.id)} className="delete-button">Delete</button>

                        <button onClick={() => handleToggleComplete(task.id)}>
                          {task.completed ? "Undo" : "Complete"}
                        </button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
