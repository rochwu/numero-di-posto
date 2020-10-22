import {Fill} from '../globals';

export type State = {
  history: History;
  present: number; // index of history
  disabled: Disabled;
  pencils: Pencils;
  values: Values;
  selected: Identifier[];
  filled: number; // Used to tell when to validate
};

export type Values = {
  [identifier in Identifier]: string;
};

export type Pencils = {
  [identifier in Identifier]: Pencil;
};

export type Record = {
  key: string;
  selected: Identifier[];
  fill: Fill;
};

export type History = {
  record: Record;
  values: Values;
  pencils: Pencils;
}[];

// row + column,  2 digit string
export type Identifier = string;

export type Pencil = {
  [number: string]: boolean | undefined; // 1-9
};

// How we store "givens", we disable them for interaction
export type Disabled = {
  [identifier in Identifier]: boolean | undefined;
};
