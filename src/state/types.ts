import {Fill} from '../globals';

export type State = {
  history: History;
  present: number; // index of history
  disabled: Disabled;
  selected: Identifier[];
  filled: number; // Used to tell when to validate
};

export type Inputs = {
  pencils: Pencils;
  values: Values;
  highlights: Highlights;
};

export type Values = {
  [identifier in Identifier]: string; // 1-9
};

export type Pencils = {
  [identifier in Identifier]: Pencil;
};

export type Highlights = {
  [identifier in Identifier]: string; // hex
};

export type Record = {
  key: string;
  selected: Identifier[];
  fill: Fill;
};

export type History = ({
  record: Record;
} & Inputs)[];

// row + column, 2 digit string, [0-2][0-2]
export type Identifier = string;

export type Pencil = {
  [number: string]: boolean | undefined; // 1-9
};

// How we store "givens", we disable them from interaction
export type Disabled = {
  [identifier in Identifier]: boolean | undefined;
};

export type FillArgs = Pick<Record, 'key' | 'fill'> &
  Partial<Pick<Record, 'selected'>>;
