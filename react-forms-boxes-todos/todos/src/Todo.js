import React from "react";

function Todo({ text, removeTodo }) {
  return (
    <div>{text}<button onClick={removeTodo}>X</button></div>
  );
}

export default Todo;
