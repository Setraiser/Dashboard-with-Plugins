"use client";

import { TodoItem, TodoPriority, todosStore } from '@/plugins/todo/entities/todo';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

/* 
@action addTodo(text: string) {
    const newTodo = { id: Date.now().toString(), text, completed: false, priority: TodoPriority.Low };
    this.todos.push(newTodo);
  }

  @action deleteTodo(id: string) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  @action toggleCompleted(id: string) {
    this.todos = this.todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
  }

  @action setPriority(id: string, priority: TodoPriority) {
    this.todos = this.todos.map(todo => todo.id === id ? { ...todo, priority } : todo);
  }


*/

const Todos: React.FC = () => {

  const [todos, setTodos] = useState(todosStore.todos);

  /*  useEffect(() => {
     // Обновляем состояние из store once on mount. MobX observer will handle updates.
     setTodos(todosStore.todos);
   }, []); */

  const addTodo = (text: string) => {
    todosStore.addTodo(text);
    setTodos([...todosStore.todos]);
  };

  const deleteTodo = (id: string) => {
    todosStore.deleteTodo(id);
    setTodos([...todosStore.todos]);
  };

  const toggleCompleted = (id: string) => {
    todosStore.toggleCompleted(id);
    setTodos([...todosStore.todos]);
  };

  const setPriority = (id: string, priority: TodoPriority) => {
    todosStore.setPriority(id, priority);
    setTodos([...todosStore.todos]);
  };


  return (
    <div>
      <input
        type="text"
        placeholder="Add a new todo..."
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement;
            addTodo(target.value);
          }
        }}
      />
      <ul>
        {todos.map(todo =>
          <TodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} toggleCompleted={toggleCompleted} setPriority={setPriority} />
        )}
      </ul>
    </div>
  );
};

export default observer(Todos);