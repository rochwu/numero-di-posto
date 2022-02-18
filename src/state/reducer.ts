import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Fill, getBlockIndex, getId, getIndices} from '../globals';

import {State, Identifier, Values, Inputs, FillArgs} from './types';
import {selectValues} from './selectors';
import {showPossibleSelection} from './showPossibleSelection';
import {fill} from './fill';

const initialRecord = {fill: Fill.Normal, key: '', selected: []};

const initialState: State = {
  history: [
    {
      values: {},
      pencils: {},
      highlights: {},
      record: initialRecord,
    },
  ],
  present: 0,
  disabled: {},
  selected: [],
  filled: 0,
};

const reduceHistory = ({
  present,
  state,
}: {
  present: State['present'];
  state: State;
}): State => {
  const {values} = state.history[present];

  return {
    ...state,
    present,
    filled: Object.keys(values).filter(key => values[key]).length,
  };
};

const findLastInput = (state: State): State['present'] => {
  const {history, present} = state;

  if (history[present].record.fill !== Fill.Auto) {
    return Math.max(present - 1, 0);
  }

  let it = present - 1;
  // Want what is before last input, so extra decrement at the end
  while (history[it--].record.fill === Fill.Auto) {}

  return Math.max(it, 0);
};

const resetHistory = (values: Values): Pick<State, 'history' | 'present'> => {
  return {
    history: [
      {
        values,
        pencils: {},
        highlights: {},
        record: initialRecord, // TODO: ponder whether I should spread or ref
      },
    ],
    present: 0,
  };
};

const numericRegex = new RegExp('[1-9]');

export const {reducer, actions} = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    make: (_, {payload: board}: PayloadAction<string>) => {
      const disabled: State['disabled'] = {};
      const values: Inputs['values'] = {};
      let filled = 0;

      for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const column = i % 9;

        if (numericRegex.test(board[i])) {
          const id = getId(row, column);

          values[id] = board[i];
          disabled[id] = true;
          ++filled;
        }
      }

      return {
        ...initialState,
        ...resetHistory(values),
        filled,
        disabled,
      };
    },
    fill: (state, {payload}: PayloadAction<FillArgs>) =>
      fill({state, ...payload}),
    smartFill: (state, {payload: key}: PayloadAction<string>) => {
      const selectedPerBlock = new Array(9).fill({id: '', count: 0});

      state.selected.forEach(id => {
        const {row, column} = getIndices(id);

        const index = getBlockIndex(row, column);

        selectedPerBlock[index] = {
          id,
          count: selectedPerBlock[index].count + 1,
        };
      });

      const selected = selectedPerBlock.reduce<Identifier[]>(
        (selected, {id, count}) => {
          if (count === 1) {
            selected.push(id);
          }

          return selected;
        },
        [],
      );

      return fill({state, key, fill: Fill.Normal, selected});
    },
    toggleDisabled: state => {
      if (!Object.keys(state.disabled).length) {
        const disabled: State['disabled'] = {};
        const values = selectValues(state);

        for (let x = 0; x < 9; x++) {
          for (let y = 0; y < 9; y++) {
            const id = getId(x, y);

            if (values[id]) {
              disabled[id] = true;
            }
          }
        }

        return {
          ...state,
          ...resetHistory(state.history[state.present].values),
          disabled,
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

      return reduceHistory({
        present: findLastInput(state),
        state,
      });
    },
    redo: state => {
      const present = state.present + 1;

      if (present === state.history.length) {
        return state;
      }

      return reduceHistory({present, state});
    },
    timeTravel: (state, {payload: present}) => {
      return reduceHistory({present, state});
    },
    showPossibleSelection: (
      state,
      {payload}: PayloadAction<{id: string; value: string} | undefined>,
    ) => {
      if (payload) {
        const {id, value} = payload;
        state.selected = showPossibleSelection(state, value, id);
      } else {
        // On keyboard selection there's no value in its context
        const id = state.selected[0];

        state.selected = showPossibleSelection(
          state,
          selectValues(state)[id],
          id,
        );
      }
    },
    selectAll: state => {
      const selected = [];
      const values = selectValues(state);

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const id = getId(i, j);

          if (!values[id] || state.filled === 81) {
            selected.push(id);
          }
        }
      }

      state.selected = selected;
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
