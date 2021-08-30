import {atomFamily, selectorFamily} from 'recoil';
import {getIndices, getBlockId, getBlockPosition} from '../globals';
import {autoPencilState} from '../Settings';

type Values = {
  [index: number]: string; // value
};

const getUniqueValues = (values: Values) => {
  const unique = new Set<string>();

  Object.keys(values).forEach(index => {
    unique.add(values[Number(index)]);
  });

  return unique;
};

const isColliding = (value: string, state: Values) => {
  if (!value) {
    return true;
  }

  let repeats = 0;
  for (let i = 0; i < 9; i++) {
    if (state[i] === value) {
      repeats++;
    }

    if (repeats > 1) {
      return false;
    }
  }

  return true;
};

export const rowState = atomFamily<Values, number>({
  key: 'rowState',
  default: () => ({}),
});

export const uniqueRowSelector = selectorFamily<Set<string>, number>({
  key: 'uniqueRowSelector',
  get: (id: number) => ({get}) => getUniqueValues(get(rowState(id))),
});

export const rowSelector = selectorFamily<string, string>({
  key: 'rowSelector',
  get: () => () => '',
  set: (id: string) => ({set}, value) => {
    const {row, column} = getIndices(id);

    set(rowState(row), (previous: Values) => ({
      ...previous,
      [column]: value as string, // The | DefaultValue destroys it
    }));
  },
});

export const isRowValidSelector = selectorFamily<boolean, string>({
  key: `isRowValidSelector`,
  get: (id: string) => ({get}) => {
    const {row, column} = getIndices(id);

    const state = get(rowState(row));
    const value = state[column];

    return isColliding(value, state);
  },
});

export const columnState = atomFamily<Values, number>({
  key: 'columnState',
  default: () => ({}),
});

export const uniqueColumnSelector = selectorFamily<Set<string>, number>({
  key: 'uniqueColumnSelector',
  get: (id: number) => ({get}) => getUniqueValues(get(columnState(id))),
});

export const columnSelector = selectorFamily<string, string>({
  key: 'columnSelector',
  get: () => () => '',
  set: (id: string) => ({set}, value) => {
    const {row, column} = getIndices(id);

    set(columnState(column), (previous: Values) => ({
      ...previous,
      [row]: value as string, // The | DefaultValue destroys it
    }));
  },
});

export const isColumnValidSelector = selectorFamily<boolean, string>({
  key: `isColumnValidSelector`,
  get: (id: string) => ({get}) => {
    const {row, column} = getIndices(id);

    const state = get(columnState(column));
    const value = state[row];

    return isColliding(value, state);
  },
});

export const blockState = atomFamily<Values, string>({
  key: 'blockState',
  default: () => ({}),
});

export const uniqueBlockSelector = selectorFamily<Set<string>, string>({
  key: 'uniqueBlockSelector',
  get: (id: string) => ({get}) => getUniqueValues(get(blockState(id))),
});

export const blockSelector = selectorFamily<string, string>({
  key: 'blockSelector',
  get: () => () => '',
  set: (id: string) => ({set}, value) => {
    const indices = getIndices(id);

    const block = getBlockId(indices);
    const position = getBlockPosition(indices);

    set(blockState(block), (previous: Values) => ({
      ...previous,
      [position]: value as string, // The | DefaultValue destroys it
    }));
  },
});

export const isBlockValidSelector = selectorFamily<boolean, string>({
  key: `isBlockValidSelector`,
  get: (id: string) => ({get}) => {
    const indices = getIndices(id);

    const block = getBlockId(indices);
    const position = getBlockPosition(indices);

    const state = get(blockState(block));
    const value = state[position];

    return isColliding(value, state);
  },
});

export const tryUniqueCellSelector = selectorFamily<
  Set<string> | undefined,
  string
>({
  key: 'tryUniqueCellSelector',
  get: (id: string) => ({get}) => {
    if (!get(autoPencilState)) {
      return;
    }

    const indices = getIndices(id);

    const rowSet = get(uniqueRowSelector(indices.row));
    const columnSet = get(uniqueColumnSelector(indices.column));
    const blockSet = get(uniqueBlockSelector(getBlockId(indices)));

    const cells = new Set<string>();

    for (let i = 1; i <= 9; i++) {
      const value = i.toString();

      if (blockSet.has(value) || rowSet.has(value) || columnSet.has(value)) {
        cells.add(value);
      }
    }

    return cells;
  },
});
