
"use client";

import React from 'react';

import { observer } from 'mobx-react-lite';
import { ITodoItemProps, TodoPriority } from '../../../modules/types/types';

const TodoItem: React.FC<ITodoItemProps> = observer((props) => {
  const { deleteTodo, setPriority, todo, toggleCompleted, changeText } = props;
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleCompleted(todo.id)}
      />
      <input
        type="text"
        value={todo.text}
        onChange={(e) => changeText(todo.id, e.target.value)}
      />
      <select value={todo.priority} onChange={(e) => setPriority(todo.id, e.target.value as TodoPriority)}>
        <option value={TodoPriority.Low}>Low</option>
        <option value={TodoPriority.Medium}>Medium</option>
        <option value={TodoPriority.High}>High</option>
      </select>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
});

export default TodoItem;

