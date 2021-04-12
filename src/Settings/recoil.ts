import {atom} from 'recoil';

export const isAidOnState = atom({
  key: 'isAidOnState',
  default: true,
});

export const autoPencilState = atom({
  key: 'autoPencilState',
  default: false,
});

export const canSeeHistoryState = atom({
  key: 'canSeeHistoryState',
  default: false,
});

export const canOverscrollState = atom({
  key: `canOverscrollState`,
  default: window.history.length > 1,
});

export const showMakerState = atom({
  key: 'showMakerState',
  default: false,
});
