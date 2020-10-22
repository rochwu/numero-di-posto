// AKA the garbage module

export const flags = {
  isSelecting: false,
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
};

export const FontFamily = {
  All: `Open Sans,Roboto,sans-serif`,
  OG: `Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif`,
};

export enum Fill {
  Normal,
  Pencil,
  Delete,
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
