import {Identifier, State} from './types';

export const selectSelected = ({selected}: State) => selected;

export const selectDisabled = ({disabled}: State) => disabled;

export const selectIsDisabled = (id: Identifier) => (state: State) =>
  !!selectDisabled(state)[id];

export const selectPencils = ({history, present}: State) =>
  history[present].pencils;

export const selectValues = ({history, present}: State) =>
  history[present].values;

export const selectHighlights = ({history, present}: State) =>
  history[present].highlights;

export const selectPencil = (id: Identifier) => (state: State) =>
  selectPencils(state)[id];

export const selectValue = (id: Identifier) => (state: State) =>
  selectValues(state)[id];

export const selectHighlight = (id: Identifier) => (state: State) =>
  selectHighlights(state)[id];

export const selectIsSelected = (id: Identifier) => ({selected}: State) =>
  selected.indexOf(id) >= 0;

export const selectIsFirstSelected = (id: Identifier) => ({selected}: State) =>
  selected.length > 1 ? selected[0] === id : false;

export const selectIsFilled = ({filled}: State) => filled === 81;

export const selectHasValues = ({filled}: State) => filled > 0;

// Returns the ref to differentiate between cycling through new games
export const selectStarted = ({history}: State) => {
  if (history.length === 1) {
    return history[0];
  }
  return;
};
