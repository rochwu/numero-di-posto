// 81 digits string, 0-9 where 0 is empty
export type Grid = string;

// 000000010400000000020000000000050407008000300001090000300400200050100000000806000

// row[1-9] + column[1-9] + value[1-9]
// ie: "112" is value "2" on the topmost leftmost cell
export const tuplesToGrid = (...tuples: string[]): Grid => {
  const dictionary: {[key: number]: string} = {};

  tuples.forEach(tuple => {
    const row = (parseInt(tuple[0], 10) - 1) * 9;
    const column = parseInt(tuple[1], 10);
    const index = row + column;

    dictionary[index] = tuple[2];
  });

  let grid = '';

  for (let i = 1; i <= 81; i++) {
    grid += dictionary[i] || '0';
  }

  return grid;
};
