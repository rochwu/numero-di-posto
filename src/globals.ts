// AKA the garbage module

export const flags = {
  isSelecting: false,
  selectingFill: true,
};

export const LIST = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const Size = {
  Pen: `60px`,
  PenFont: `45px`,
  Pencil: `20px`,
  PencilFont: `12px`,
};

export const Colors = {
  Fill: '#1e88e5',
  Error: `#d32f2f`,
  Selected: `#fff59d`,
  Disabled: 'black',
  Pencil: `#757575`,
  Highlight: [
    '#8adbd3',
    '#edafb0',
    '#dfecba',
    '#b4beec',
    '#dfb5e0',
    '#a4d3a8',
    '#81c9ea',
    '#bac68d',
    '#ddc094',
  ],
};

export const FontFamily = {
  All: `Open Sans,Roboto,sans-serif`,
  OG: `Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif`,
};

export enum Fill {
  Normal,
  Pencil,
  Delete,
  Auto,
  Color,
}

export type Indices = {
  row: number;
  column: number;
};

export const getId = (row: number | string, column: number | string) => {
  return `${row}${column}`;
};

export const getIndices = ({0: row, 1: column}: string) => {
  return {
    row: parseInt(row, 10),
    column: parseInt(column, 10),
  };
};

export const isWithin = (test: number, lower: number, upper: number) => {
  return lower <= test && test <= upper;
};

export const transformId = (id: string, indices: Indices) => {
  const {row, column} = getIndices(id);

  const nextRow = row + indices.row;
  const nextColumn = column + indices.column;

  if (isWithin(nextRow, 0, 8) && isWithin(nextColumn, 0, 8)) {
    return getId(nextRow, nextColumn);
  } else {
    return '';
  }
};

export const getRandomNumber = (max: number, min: number = 0) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getBlockIndex = (row: number, column: number) => {
  return Math.floor(row / 3) * 3 + Math.floor(column / 3);
};

export const getBlockId = ({row, column}: Indices) => {
  return `${row - (row % 3)}${column - (column % 3)}`;
};

// Get cell position on block
export const getBlockPosition = ({row, column}: Indices) => {
  return (row % 3) * 3 + (column % 3);
};
