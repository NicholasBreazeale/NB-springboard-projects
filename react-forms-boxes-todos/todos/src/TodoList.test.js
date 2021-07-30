import React from "react";
import { fireEvent, render } from "@testing-library/react";
import TodoList from "./TodoList";

it("renders without crashing", function() {
  render(<TodoList />);
});

it("matches snapshot", function() {
  const { asFragment } = render(<TodoList />);
  expect(asFragment()).toMatchSnapshot();
});

it("can add and remove tasks", function() {
  const { queryByLabelText, queryByTestId, asFragment } = render(<TodoList />);

  // no tasks should be rendered yet
  const todoList = queryByTestId("todo-list");
  expect(asFragment()).toMatchSnapshot();

  const textInput = queryByLabelText("Todo:");
  const submitButton = queryByTestId("submit-btn");

  // create a new task
  fireEvent.change(textInput, { target: { value: "Hello world!" } });
  fireEvent.click(submitButton);

  // 1 task and its delete button should be rendered
  expect(asFragment()).toMatchSnapshot();

  // delete task and its button
  fireEvent.click(todoList.children[0]);
  expect(asFragment()).toMatchSnapshot();
});