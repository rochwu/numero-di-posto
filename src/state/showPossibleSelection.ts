import {selectValues} from './selectors';
import {Identifier, State} from './types';
import {getBlockIndex} from '../globals';

export const showPossibleSelection = (
  state: State,
  value: string,
  id: Identifier,
) => {
  const values = selectValues(state);

  // Found on:
  const rows = new Array(9).fill(false);
  const columns = new Array(9).fill(false);
  const blocks = new Array(9).fill(false);

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      const identifier = `${row}${column}`;

      if (values[identifier] === value) {
        rows[row] = true;
        columns[column] = true;
        blocks[getBlockIndex(row, column)] = true;
      }
    }
  }

  const possibilities = [id];

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      const identifier = `${row}${column}`;

      if (
        identifier !== id &&
        !values[identifier] &&
        !blocks[getBlockIndex(row, column)] &&
        !rows[row] &&
        !columns[column]
      ) {
        possibilities.push(identifier);
      }
    }
  }

  return possibilities;
};
