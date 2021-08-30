import {atom} from 'recoil';

// Show possible values for each column + row
export const columRowAidState = atom({
  key: 'isAidOnState',
  default: false,
});

export const autoPencilState = atom({
  key: 'autoPencilState',
  default: false,
});

export const autoSelectPossibleState = atom({
  key: 'autoSelectPossibleState',
  default: true,
});

export const smartFill = atom({
  key: 'smartFill',
  default: true,
});

// Convenience + Game Config
export const showHistoryState = atom({
  key: 'showHistoryState',
  default: false,
});

export const showMakerState = atom({
  key: 'showMakerState',
  default: false,
});

// UI Overrides
export const canOverscrollState = atom({
  key: `canOverscrollState`,
  default: window.history.length > 1,
});
