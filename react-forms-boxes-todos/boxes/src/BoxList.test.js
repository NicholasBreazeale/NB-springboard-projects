import React from "react";
import { fireEvent, render } from "@testing-library/react";
import BoxList from "./BoxList";

it("renders without crashing", function() {
  render(<BoxList />);
});

it("matches snapshot", function() {
  const { asFragment } = render(<BoxList />);
  expect(asFragment()).toMatchSnapshot();
});

it("can add and remove boxes", function() {
  const { queryByLabelText, queryByTestId, asFragment } = render(<BoxList />);

  // no boxes should be rendered yet
  const boxList = queryByTestId("box-list");
  expect(boxList.children.length).toBe(0);

  const colorInput = queryByLabelText("Color:");
  const widthInput = queryByLabelText("Width:");
  const heightInput = queryByLabelText("Height:");
  const submitButton = queryByTestId("submit-btn");

  // create a new box
  fireEvent.change(colorInput, { target: { value: "#ff00ff" } });
  fireEvent.change(widthInput, { target: { value: "50" } });
  fireEvent.change(heightInput, { target: { value: "50" } });
  fireEvent.click(submitButton);

  // 1 box and its delete button should be rendered
  expect(asFragment()).toMatchSnapshot();

  // delete box and its button
  fireEvent.click(boxList.children[1]);
  expect(asFragment()).toMatchSnapshot();
});
