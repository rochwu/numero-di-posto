import {Fill} from '../globals';

import {State, FillArgs, Inputs} from './types';
import {
  selectDisabled,
  selectHighlights,
  selectPencils,
  selectValues,
} from './selectors';

export const fill = (args: {state: State} & FillArgs): State => {
  const {state, key, fill} = args;

  const values = selectValues(state);
  const pencils = selectPencils(state);
  const highlights = selectHighlights(state);
  const disabled = selectDisabled(state);

  const selected = (args.selected || state.selected).filter(id => {
    const isDisabled = disabled[id];

    const isUnnotable =
      values[id] && (fill === Fill.Pencil || fill === Fill.Color);

    return !(isDisabled || isUnnotable);
  });

  if (!selected.length) {
    return state;
  }

  const changes = selected.reduce<Pick<State, 'filled'> & Inputs>(
    (changes, id) => {
      switch (fill) {
        case Fill.Auto:
        case Fill.Normal: {
          if (!values[id]) {
            ++changes.filled;
          }

          changes.values[id] = key;
          break;
        }
        case Fill.Delete: {
          if (values[id]) {
            --changes.filled;
            changes.values[id] = '';
          } else if (highlights[id]) {
            changes.highlights[id] = '';
          } else {
            changes.pencils[id] = {};
          }
          break;
        }
        case Fill.Pencil: {
          const {[key]: mark, ...marks} = pencils[id] || {};

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
        case Fill.Color: {
          changes.highlights[id] = key;
          break;
        }
      }

      return changes;
    },
    // Minimizes spread per iteration by accumulating first
    {filled: 0, values: {}, pencils: {}, highlights: {}},
  );

  const period = {
    pencils: {
      ...pencils,
      ...changes.pencils,
    },
    values: {
      ...values,
      ...changes.values,
    },
    highlights: {
      ...highlights,
      ...changes.highlights,
    },
    record: {key, fill, selected},
  };

  const present = state.present + 1;
  const history = [...state.history.slice(0, present), period]; // Override from current present
  const filled = state.filled + changes.filled;

  return {...state, history, present, filled};
};
