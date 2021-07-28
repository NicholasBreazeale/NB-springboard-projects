import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=5, chanceLightStartsOn=0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    return Array.from({length: nrows}, () => Array.from({length: ncols}, () => Math.random() < chanceLightStartsOn));
  }

  function hasWon() {
    return board.every(row => row.every(cell => !cell));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const newBoard = oldBoard.map(cell => cell.map(v => v));

      flipCell(y, x, newBoard);
      flipCell(y-1, x, newBoard);
      flipCell(y+1, x, newBoard);
      flipCell(y, x-1, newBoard);
      flipCell(y, x+1, newBoard);

      return newBoard;
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  if (hasWon()) return (
    <h1>You Won!</h1>
  );

  // make table board

  return (
    <table>
      <tbody>
        {board.map((row, y) =>
          <tr key={y}>{row.map((val, x) =>
            <Cell key={`${y}-${x}`} flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)} isLit={val} />
          )}
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default Board;
