import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Fill, getId} from '../globals';

import {State, Record, Identifier} from './types';

import {selectIsDisabled, selectValue} from './selectors';

const initialRecord = {fill: Fill.Normal, key: '', selected: []};

const initialState: State = {
  values: {},
  pencils: {},
  history: [
    {
      values: {},
      pencils: {},
      record: initialRecord,
    },
  ],
  present: 0,
  disabled: {},
  selected: [],
  filled: 0,
};

const getChanges = ({selected, state, key, fill}: Record & {state: State}) => {
  return selected.reduce<Pick<State, 'pencils' | 'values' | 'filled'>>(
    (changes, id) => {
      switch (fill) {
        case Fill.Normal: {
          if (!state.values[id]) {
            changes.filled++;
          }

          changes.values[id] = key;
          break;
        }
        case Fill.Delete: {
          if (state.values[id]) {
            changes.filled--;
            changes.values[id] = key;
          } else {
            changes.pencils[id] = {};
          }
          break;
        }
        case Fill.Pencil: {
          const {[key]: mark, ...marks} = state.pencils[id] || {};

          if (mark) {
            changes.pencils[id] = marks;
          } else {
            changes.pencils[id] = {
              ...marks,
              [key]: true,
            };
          }
          break;
        }
      }

      return changes;
    },
    {pencils: {}, values: {}, filled: 0},
  );
};

const reduceHistory = ({present, state}: {present: number; state: State}) => ({
  ...state,
  present,
  pencils: state.history[present].pencils,
  values: state.history[present].values,
});

export const {reducer, actions} = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    fill: (state, {payload}: PayloadAction<Record>) => {
      const {key, fill} = payload;

      // Separated to improve maintanability
      const selected = payload.selected.filter(id => {
        const value = selectValue(id)(state);
        const isDisabled = selectIsDisabled(id)(state);

        return !(isDisabled || (fill === Fill.Pencil && value));
      });

      if (!selected.length) {
        return state;
      }

      const changes = getChanges({selected, state, key, fill});

      const present = state.present + 1;
      const record = {fill, key, selected};
      const pencils = {
        ...state.pencils,
        ...changes.pencils,
      };
      const values = {
        ...state.values,
        ...changes.values,
      };

      return {
        ...state,
        history: [
          ...state.history.slice(0, present),
          {pencils, values, record},
        ],
        present,
        pencils,
        values,
        filled: state.filled + changes.filled,
      };
    },
    toggleDisabled: state => {
      if (!Object.keys(state.disabled).length) {
        const disabled: State['disabled'] = {};

        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            const id = getId(i, j);

            if (state.values[id]) {
              disabled[id] = true;
            }
          }
        }

        const {record: _, ...history} = state.history[state.present];

        return {
          ...state,
          disabled,
          history: [
            {
              ...history,
              record: initialRecord,
            },
          ],
          present: 0,
        };
      } else {
        return {
          ...state,
          disabled: {},
        };
      }
    },
    undo: state => {
      if (state.present === 0) {
        return state;
      }

      const present = state.present - 1;

      return reduceHistory({present, state});
    },
    redo: state => {
      const present = state.present + 1;

      if (present === state.history.length) {
        return state;
      }

      return reduceHistory({present, state});
    },
    historyJump: (state, {payload: present}) => {
      return reduceHistory({present, state});
    },
    select: (
      state,
      {
        payload: {id, isSelected},
      }: PayloadAction<{id: Identifier; isSelected: boolean}>,
    ) => {
      const foundAt = state.selected.indexOf(id);

      if (foundAt >= 0) {
        if (!isSelected) {
          return {
            ...state,
            selected: [
              ...state.selected.slice(0, foundAt),
              ...state.selected.slice(foundAt + 1),
            ],
          };
        }
      } else {
        if (isSelected) {
          return {
            ...state,
            selected: [...state.selected, id],
          };
        }
      }

      return state;
    },
    setSelected: (state, {payload: selected}) => ({
      ...state,
      selected,
    }),
    clearSelected: state => ({
      ...state,
      selected: [],
    }),
  },
});
