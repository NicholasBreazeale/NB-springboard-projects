function starOutGrid(grid) {
	"use strict";

	// Determine which rows and columns to star out
	const rows = [], cols = [];
	for (const row in grid) {
		for (const col in grid[row]) {
			if (grid[row][col] === "*") {
				if (!rows.includes(row)) rows.push(row);
				if (!cols.includes(col)) cols.push(col);
			}
		}
	}

	// Star out rows
	for (const row of rows) {
		for (const i in grid[row]) {
			grid[row][i] = "*";
		}
	}
	// Star out columns
	for (const col of cols) {
		for (const i in grid) {
			grid[i][col] = "*";
		}
	}

	return grid;
}