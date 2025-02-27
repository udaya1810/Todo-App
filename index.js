const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tododb",
});

db.connect(err => {
    if (err) console.error("DB Connection Error:", err);
    else console.log("Connected to MySQL");
});

// Real-time Socket.io Connection
io.on("connection", socket => {
    console.log("User connected");

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// API Routes
app.get("/todos", (req, res) => {
    db.query("SELECT * FROM todos", (err, result) => {
        if (err) res.status(500).send(err);
        else res.json(result);
    });
});

app.post("/todos", (req, res) => {
    const { task } = req.body;
    db.query("INSERT INTO todos (task) VALUES (?)", [task], (err, result) => {
        if (err) res.status(500).send(err);
        else {
            io.emit("todoUpdated");
            res.json({ id: result.insertId, task, completed: false });
        }
    });
});

app.put("/todos/:id", (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    db.query("UPDATE todos SET completed = ? WHERE id = ?", [completed, id], (err) => {
        if (err) res.status(500).send(err);
        else {
            io.emit("todoUpdated");
            res.send("Updated successfully");
        }
    });
});

app.delete("/todos/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM todos WHERE id = ?", [id], (err) => {
        if (err) res.status(500).send(err);
        else {
            io.emit("todoUpdated");
            res.send("Deleted successfully");
        }
    });
});

// Start Server
server.listen(5000, () => console.log("Server running on port 5000"));
