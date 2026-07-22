
"use client";

import React from 'react';

import { ITodoItemProps, TodoPriority } from '../../../modules/types/types';

const TodoItem: React.FC<ITodoItemProps> = (props) => {
  const { deleteTodo, setPriority, todo, toggleCompleted } = props;
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleCompleted(todo.id)}
      />
      <span>{todo.text}</span>
      <select value={todo.priority} onChange={(e) => setPriority(todo.id, e.target.value as TodoPriority)}>
        <option value={TodoPriority.Low}>Low</option>
        <option value={TodoPriority.Medium}>Medium</option>
        <option value={TodoPriority.High}>High</option>
      </select>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
};

export default TodoItem;

