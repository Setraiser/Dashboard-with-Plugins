"use client";

import { TodoItem, TodoPriority, todosStore } from '@/plugins/todo/entities/todo';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

const Todos: React.FC = () => {

  const [value, setValue] = useState<string>("");

  useEffect(() => {
    todosStore.getTodos();
  }, []);

  const addTodo = (text: string) => {
    todosStore.addTodo(text);
  }


  const deleteTodo = (id: string) => {
    todosStore.deleteTodo(id);
  };

  const toggleCompleted = (id: string) => {
    todosStore.toggleCompleted(id);
  };

  const setPriority = (id: string, priority: TodoPriority) => {
    todosStore.setPriority(id, priority);
  };

  const changeText = (id: string, text: string) => {
    todosStore.changeText(id, text);
  };

  const saveTodos = () => {
    todosStore.save();
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Add a new todo..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement;
            addTodo(target.value);
            setValue("");
          }
        }}
      />
      <ul>
        {todosStore.todoList.map((todo) =>
          <TodoItem key={todo.id} todo={todo} changeText={changeText} deleteTodo={deleteTodo} toggleCompleted={toggleCompleted} setPriority={setPriority} />
        )}
      </ul>
      <input type="button" value="Save Todos" onClick={saveTodos} />
    </div>
  );
};

export default observer(Todos);