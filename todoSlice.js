import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions for API calls
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
    const response = await axios.get("http://localhost:5000/todos");
    return response.data;
});

export const addTodo = createAsyncThunk("todos/addTodo", async (task) => {
    const response = await axios.post("http://localhost:5000/todos", { task });
    return response.data;
});

export const toggleComplete = createAsyncThunk("todos/toggleComplete", async ({ id, completed }) => {
    await axios.put(`http://localhost:5000/todos/${id}`, { completed });
    return { id, completed: !completed };
});

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id) => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    return id;
});

const todoSlice = createSlice({
    name: "todos",
    initialState: { todos: [], status: "idle" },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.todos = action.payload;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.todos.push(action.payload);
            })
            .addCase(toggleComplete.fulfilled, (state, action) => {
                const todo = state.todos.find((t) => t.id === action.payload.id);
                if (todo) todo.completed = action.payload.completed;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.todos = state.todos.filter((t) => t.id !== action.payload);
            });
    },
});

export default todoSlice.reducer;
