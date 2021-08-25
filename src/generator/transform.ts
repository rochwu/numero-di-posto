import {Grid} from './normalizers';
import {getRandomNumber} from '../globals';

// '000000010400000000020000000000050407008000300001090000300400200050100000000806000';

const getGridIndex = (row: number, column: number) => {
  return row * 9 + column;
};

const mutateOrder = <T>(sequence: T[]): T[] => {
  let last = sequence.length,
    pick,
    temp;

  while (last) {
    pick = Math.floor(Math.random() * last--);

    temp = sequence[pick];
    sequence[pick] = sequence[last];
    sequence[last] = temp;
  }

  return sequence;
};

const createNumberTranslator = () => {
  const sequence = mutateOrder([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  return (value: string) => {
    switch (value) {
      case '1':
        return sequence[0];
      case '2':
        return sequence[1];
      case '3':
        return sequence[2];
      case '4':
        return sequence[3];
      case '5':
        return sequence[4];
      case '6':
        return sequence[5];
      case '7':
        return sequence[6];
      case '8':
        return sequence[7];
      case '9':
        return sequence[8];
      default:
        return value; // '0'
    }
  };
};

// 3x9 or 9x3 sections are interchangable
// Internal rows or columns are also interchangable
const reorderIndices = () => {
  const first = mutateOrder([0, 1, 2]);
  const second = mutateOrder([3, 4, 5]);
  const third = mutateOrder([6, 7, 8]);

  const section = mutateOrder([first, second, third]);

  return [...section[0], ...section[1], ...section[2]];
};

const createIndicesTranslator = () => {
  const sequence = reorderIndices();

  return (index: number) => sequence[index];
};

const transposeXY = (row: number, column: number) => {
  return getGridIndex(column, row);
};

const transposeXYInverse = (row: number, column: number) => {
  return getGridIndex(8 - column, 8 - row);
};

// In essence reverse
const transposeCombined = (row: number, column: number) => {
  return 80 - getGridIndex(row, column);
};

const createTransposer = () => {
  const transposer = getRandomNumber(2); // 0, 1, 2

  switch (transposer) {
    case 0:
      return transposeXY;
    case 1:
      return transposeXYInverse;
    default:
      return transposeCombined;
  }
};

export const transform = (input: Grid): Grid => {
  let output = '';

  const translateRow = createIndicesTranslator();
  const translateColumn = createIndicesTranslator();

  const transpose = createTransposer();
  const translateNumber = createNumberTranslator();

  for (let x = 0; x < 9; ++x) {
    const row = translateRow(x);

    for (let y = 0; y < 9; ++y) {
      const column = translateColumn(y);
      const value = input[transpose(row, column)];
      output += translateNumber(value);
    }
  }

  return output;
};
