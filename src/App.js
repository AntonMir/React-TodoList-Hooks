import React, { useState, useEffect } from 'react'
import TodoList from './TodoList'
import {Context} from './context'

export default function App() {

    const [todos, setTodos] = useState([]);
    const [todoTitle, setTodoTitle] = useState('');

    const handleClick = () => {
        console.log('---', 'click');
    }

    useEffect(() => {
        const raw = localStorage.getItem('todos') || '[]';
        setTodos(JSON.parse(raw));
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClick)
        localStorage.setItem('todos', JSON.stringify(todos));
        return () => {
            // убираем лишкий слушатель, чтоб не перегружать страницу
            document.removeEventListener('click', handleClick);
        }
    }, [todos]);

    const addTodo = event => {
        if (event.key === 'Enter') {
            setTodos([
                {
                    id: Date.now(),
                    title: todoTitle,
                    completed: false                
                },
                ...todos
            ])
            setTodoTitle('')
        }
    }

    const removeTodo = id => {
        setTodos(todos.filter(todo => {
            return todo.id !== id
        }))
    }

    const toggleTodo = (id) => {
        setTodos(todos.map(todo => {
            if(todo.id === id) {
                todo.completed = !todo.completed;
            }
            return todo;
        }))
    }

    return (
        <Context.Provider value={{
            toggleTodo, removeTodo
        }}>
            <div className="container">
                <h1>Todo app</h1> 

                <div className="input-field">
                    <input 
                        type="text" 
                        placeholder="Todo name"
                        required
                        value={todoTitle}
                        onChange={event => {setTodoTitle(event.target.value)}}
                        onKeyPress={addTodo}
                    />
                </div>

                <TodoList todos={todos} />
            </div>
        </Context.Provider>
    );
}