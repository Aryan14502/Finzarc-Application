const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const TaskFile = path.join(__dirname,'tasks.json')
const UserFile = path.join(__dirname,'user.json')

// Middleware
app.use(cors());
app.use(express.json());

const readLogin = () => {
    const data = fs.readFileSync(UserFile)
    return JSON.parse(data)
}

const writeUser = (userData) => {
    fs.writeFileSync(UserFile, JSON.stringify(userData, null, 2))
}

const readTask = () => {
    const data = fs.readFileSync(TaskFile)
    return JSON.parse(data)
}

const writeTask = (task) => {
    fs.writeFileSync(TaskFile, JSON.stringify(task, null, 2))
}

let Tasks = readTask();

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    let userData = readLogin()
    for (let i=0; i<userData.length; i++) {
        if (((userData[i].username === username) || (userData[i].email === username)) && userData[i].password === password) {
            return res.status(200).json({ success: true });
        }
    }
    res.status(401).json({ success: false, message: "Invalid credentials" });
});

app.post("/api/create", (req, res) => {
    const { username, email, password } = req.body;
    if (username && email && password) {
        let userData = readLogin()
        for (let i=0; i<userData.length; i++) {
            if (userData[i].username === username || userData[i].email === email) {
                return res.status(400).json({ success: false, message: "User already exists" })
            }
        }
        userData.push({
            username,
            email,
            password
        })
        writeUser(userData)
        res.status(200).json({ success: true, message: "User created" });
    } else {
        res.status(400).json({ success: false, message: "Error generating user" });
    }
});

app.post("/api/add-task", (req, res) => {
    const { id, message, complete } = req.body;
    if (id && message && typeof complete !== 'undefined') {
        Tasks.push({
            id,
            message,
            complete
        });
        writeTask(Tasks);
        res.status(200).json({ success: true, message: "Task added successfully" });
    } else {
        res.status(400).json({ success: false, message: "Error adding the task. Please try again" });
    }
});

app.get("/api/view-tasks", (req, res) => {
    Tasks = readTask();
    res.status(200).json(Tasks);
});

app.put("/api/update-task", (req, res) => {
    const { id, message, complete } = req.body;

    if (id && message && typeof complete !== 'undefined') {
        let Tasks = readTask();
        const index = Tasks.findIndex(task => task.id === id);

        if (index !== -1) {
            Tasks[index].message = message;
            Tasks[index].complete = complete;
            writeTask(Tasks);
            res.status(200).json({ success: true, message: "Task updated successfully" });
        } else {
            res.status(404).json({ success: false, message: "Task not found" });
        }
    } else {
        res.status(400).json({ success: false, message: "Invalid request body" });
    }
});

app.put("/api/delete-task", (req, res) => {
    const { id } = req.body;

    if (id) {
        const index = Tasks.findIndex(task => task.id === id);

        if (index !== -1) {
            let Tasks = readTask();
            Tasks.splice(index, 1);
            writeTask(Tasks)
            res.status(200).json({ success: true, message: "Task deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "Task not found" });
        }
    } else {
        res.status(400).json({ success: false, message: "Invalid request body" });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
