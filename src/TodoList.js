import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';



const API_URL = 'https://henrikas-todo-backend-74f0ca48359c.herokuapp.com/todos';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        axios.get(API_URL)
            .then(response => setTodos(response.data))
            .catch(error => console.error('Error fetching data: ', error));
    }, []);

    const addTodo = () => {
        axios.post(API_URL, { name: newTodo, is_checked: false })
            .then(response => {
                setTodos([...todos, response.data]);
                setNewTodo('');
            })
            .catch(error => console.error('Error adding todo: ', error));
    };

    const updateTodo = (id, is_checked) => {
        axios.put(`${API_URL}/${id}`, { is_checked })
            .then(response => {
                setTodos(todos.map(todo => todo._id === id ? response.data : todo));
            })
            .catch(error => console.error('Error updating todo: ', error));
    };

    const deleteTodo = (id) => {
        axios.delete(`${API_URL}/${id}`)
            .then(() => {
                setTodos(todos.filter(todo => todo._id !== id));
            })
            .catch(error => console.error('Error deleting todo: ', error));
    };

    return (
        <div className="todo-list">
            <input
                type="text"
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                placeholder="New todo..."
            />
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map(todo => (
                    <li key={todo._id} className="todo-item">
                        <div className="todo-content">

                            <input
                                type="checkbox"
                                checked={todo.is_checked}
                                onChange={() => updateTodo(todo._id, !todo.is_checked)}
                            />
                            <span className={todo.is_checked ? 'completed' : ''}>{todo.name}</span>
                        </div>
                        <button className="delete-button" onClick={() => deleteTodo(todo._id)}>
                            <FontAwesomeIcon icon={faTrash} size='xs'/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
