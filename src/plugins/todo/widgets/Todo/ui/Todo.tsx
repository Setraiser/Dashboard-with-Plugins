"use client";

import { TodoItem, TodosStore } from '@/plugins/todo/entities/todo';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { ITodoItem, TodoPriority, useTodoApi, useTodoHandlers } from "../../../entities/todo";
import { ITodoProps } from "../types/todo";

const Todos: React.FC<ITodoProps> = ({ pluginDependencies }) => {


  const { todoApi } = pluginDependencies;

  const [value, setValue] = useState<string>("");

  const todoQueries = useTodoApi(todoApi);


  const todosStore = useMemo(() => new TodosStore(), []);
  const { handleCreateTodo, handleDeleteTodo, handleSave } = useTodoHandlers(todosStore, todoQueries);

  const {
    data: todos = [],
  } = todoQueries.getTodos;


  const visibleTodos = todos.map((todo) => {
    const changes = todosStore.getChanges(todo.id);

    return changes
      ? { ...todo, ...changes }
      : todo;
  });

  const addTodo = (text: string) => {
    handleCreateTodo({ text, priority: TodoPriority.Low });
  }


  const deleteTodo = (id: string) => {
    handleDeleteTodo(id);
  };

  const toggleCompleted = (todoItem: ITodoItem) => {
    todosStore.toggleCompleted(todoItem);
  };

  const setPriority = (id: string, priority: TodoPriority) => {
    todosStore.setPriority(id, priority);
  };

  const changeText = (id: string, text: string) => {
    todosStore.changeText(id, text);
  };

  const saveTodos = () => {
    handleSave();
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
        {visibleTodos.map((todo) =>
          <TodoItem
            key={todo.id}
            todo={todo}
            changeText={changeText}
            deleteTodo={deleteTodo}
            toggleCompleted={toggleCompleted}
            setPriority={setPriority}
          />
        )}
      </ul>
      <input type="button" value="Save Todos" onClick={saveTodos} />
    </div>
  );
};

export default observer(Todos);