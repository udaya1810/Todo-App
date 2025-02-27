import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos, addTodo, toggleComplete, deleteTodo } from "./store/todoSlice";
import { io } from "socket.io-client";
import "./index.css";

const socket = io("http://localhost:5000");

function App() {
    const [task, setTask] = useState("");
    const dispatch = useDispatch();
    const todos = useSelector((state) => state.todos.todos);

    useEffect(() => {
        dispatch(fetchTodos());
        socket.on("todoUpdated", () => dispatch(fetchTodos()));
        return () => socket.off("todoUpdated");
    }, [dispatch]);

    const handleAddTodo = () => {
        if (task.trim()) {
            dispatch(addTodo(task));
            setTask("");
        }
    };

    return (
        <div className="container">
            <h1> To-Do App</h1>
            <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Enter task..." />
            <button onClick={handleAddTodo}>Add</button>

            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <span
                            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
                            onClick={() => dispatch(toggleComplete(todo))}
                        >
                            {todo.task}
                        </span>
                        <button onClick={() => dispatch(deleteTodo(todo.id))}>❌</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
