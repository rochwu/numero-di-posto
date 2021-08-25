import {Grid} from './normalizers';

const canonical =
  '000000010400000000020000000000050407008000300001090000300400200050100000000806000';

const getGridIndex = (row: number, column: number) => {
  return row * 9 + column;
};

const getRandomSequence = () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let last = 9,
    pick,
    temp;

  while (last) {
    pick = Math.floor(Math.random() * last--);

    temp = array[pick];
    array[pick] = array[last];
    array[last] = temp;
  }

  return array;
};

export const swapXY = (input: Grid): Grid => {
  let output = '';

  for (let row = 0; row < 9; ++row) {
    for (let column = 0; column < 9; ++column) {
      output += input[getGridIndex(column, row)];
    }
  }

  return output;
};

export const swapXYInversed = (input: Grid): Grid => {
  let output = '';

  for (let row = 0; row < 9; ++row) {
    for (let column = 0; column < 9; ++column) {
      output += input[getGridIndex(8 - column, 8 - row)];
    }
  }

  return output;
};

// AKA swapXY + swapXYInversed
export const reverse = (input: Grid): Grid => {
  let output = '';

  for (let i = 0; i < 81; i++) {
    output = input[i] + output;
  }

  return output;
};

const createNumberTranslator = () => {
  const sequence = getRandomSequence();

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
        return value;
    }
  };
};

export const shuffleNumbers = (input: Grid): Grid => {
  let output = '';
  const translate = createNumberTranslator();

  for (let i = 0; i < 81; i++) {
    output += translate(input[i]);
  }

  return output;
};

// TODO: think about consolidating transformations into functions to just loop on set once
