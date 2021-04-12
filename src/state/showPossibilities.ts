import {State} from './types';

const getBlockId = (row: number, column: number) => {
  return Math.floor(row / 3) * 3 + Math.floor(column / 3);
};

export const showPossibilities = (state: State, value: string) => {
  const {values} = state;

  // Found on:
  const rows = new Array(9).fill(false);
  const columns = new Array(9).fill(false);
  const blocks = new Array(9).fill(false);

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      const id = `${row}${column}`;

      if (values[id] === value) {
        rows[row] = true;
        columns[column] = true;
        blocks[getBlockId(row, column)] = true;
      }
    }
  }

  const possibilities = [];

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      const id = `${row}${column}`;

      if (
        !values[id] &&
        !blocks[getBlockId(row, column)] &&
        !rows[row] &&
        !columns[column]
      ) {
        possibilities.push(id);
      }
    }
  }

  return possibilities;
};
