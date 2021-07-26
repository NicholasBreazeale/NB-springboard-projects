import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Coin from "./Coin";

beforeEach(function() {
  jest
    .spyOn(Math, "random")
    .mockReturnValueOnce(0.25)
    .mockReturnValueOnce(0.75);
});

afterEach(function() {
  Math.random.mockRestore();
});

it("renders without crashing", function() {
  render(<Coin />);
});

it("works when you flip the coin", function () {
  const { queryByTestId, queryByText } = render(<Coin />);

  // coin image should not be displayed yet
  expect(queryByTestId("coin-img")).not.toBeInTheDocument();

  // flip the coin to tails
  const flipBtn = queryByTestId("flip-btn");
  fireEvent.click(flipBtn);

  // now coin image should appear
  expect(queryByTestId("coin-img")).toBeInTheDocument();

  // image should be of tails and the text should update to match
  expect(queryByTestId("coin-img")).toHaveAttribute("src", "2017-D_Roosevelt_dime_reverse_transparent.png");
  expect(queryByText("Out of 1 flips, there have been 0 heads and 1 tails.")).toBeInTheDocument();

  // flip the coin to heads
  fireEvent.click(flipBtn);

  // image should be of heads and the text should update to match
  expect(queryByTestId("coin-img")).toHaveAttribute("src", "2017-D_Roosevelt_dime_obverse_transparent.png");
  expect(queryByText("Out of 2 flips, there have been 1 heads and 1 tails.")).toBeInTheDocument();
});