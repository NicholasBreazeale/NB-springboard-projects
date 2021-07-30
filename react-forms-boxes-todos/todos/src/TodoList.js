import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Todo from "./Todo";
import NewTodoForm from "./NewTodoForm";

function TodoList() {
  const [todos, setTodos] = useState([]);

  function addTodo({ text }) {
    setTodos(t => [...t, {id: uuidv4(), text}]);
  }

  function removeTodo(id) {
    setTodos(todos.filter(t => t.id !== id));
  }

  return (
    <>
      <NewTodoForm addTodo={addTodo} />
      <div data-testid="todo-list">
        {todos.map(t =>
          <Todo text={t.text} removeTodo={() => removeTodo(t.id)} key={t.id} />
        )}
      </div>
    </>
  );
}

export default TodoList;
