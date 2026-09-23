
"use client";

import { observer } from 'mobx-react-lite';
import React from 'react';
import { ITodoItemProps, priorityLabels, TodoPriority } from '../../modules/types/types';

const TodoItem: React.FC<ITodoItemProps> = observer((props) => {
  const { deleteTodo, setPriority, todo, toggleCompleted, changeText } = props;
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleCompleted(todo)}
      />
      <input
        type="text"
        value={todo.text}
        onChange={(e) => changeText(todo.id, e.target.value)}
      />
      <select value={todo.priority} onChange={(e) => setPriority(todo.id, e.target.value as TodoPriority)}>
        <option value={TodoPriority.Low}>{priorityLabels[TodoPriority.Low]}</option>
        <option value={TodoPriority.Medium}>{priorityLabels[TodoPriority.Medium]}</option>
        <option value={TodoPriority.High}>{priorityLabels[TodoPriority.High]}</option>
      </select>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
});

export default TodoItem;

