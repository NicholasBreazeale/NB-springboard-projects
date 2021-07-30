import React, { useState } from "react";

function NewTodoForm({ addTodo }) {
  const [todoInput, setTodoInput] = useState("");

  function handleTodoInputChange(event) {
    setTodoInput(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    addTodo({ text: todoInput });
    setTodoInput("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text">Todo:</label>
      <input id="text" name="text" type="text" value={todoInput} onChange={handleTodoInputChange} />
      <button data-testid="submit-btn">Add</button>
    </form>
  );
}

export default NewTodoForm;
