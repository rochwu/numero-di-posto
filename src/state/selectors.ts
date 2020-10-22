import {Identifier, State} from './types';

export const selectIsDisabled = (id: Identifier) => ({disabled}: State) =>
  !!disabled[id];

export const selectPencil = (id: Identifier) => (state: State) =>
  state.pencils[id];

export const selectValue = (id: Identifier) => (state: State) =>
  state.values[id];

export const selectIsSelected = (id: Identifier) => ({selected}: State) =>
  selected.indexOf(id) >= 0;

export const selectIsFirstSelected = (id: Identifier) => ({selected}: State) =>
  selected.length > 1 ? selected[0] === id : false;

export const selectIsFilled = ({filled}: State) => filled === 81;

export const selectHasValues = ({filled}: State) => filled > 0;
