import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const result = await axios.get('http://localhost:5000/tasks');
        setTasks(result.data.filter(task => !task.completed)); // Only fetch tasks that are not completed
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!description) return;
        try {
            const result = await axios.post('http://localhost:5000/tasks', { description });
            setTasks([...tasks, result.data]);
            setDescription('');
        } catch (error) {
            console.error('Error adding task:', error.message);
        }
    };

    const completeTask = async (id) => {
        try {
            await axios.put(`http://localhost:5000/tasks/${id}`, { completed: true });
            setTasks(tasks.filter(task => task.id !== id)); // Remove the task from the list
        } catch (error) {
            console.error('Error completing task:', error.message);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error.message);
        }
    };

    return (
        <div>
            <h1>To-Do List</h1>
            <form onSubmit={addTask}>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a new task"
                />
                <button type="submit">Add Task</button>
            </form>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <span>{task.description}</span>
                        <button onClick={() => completeTask(task.id)}>Complete</button>
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
