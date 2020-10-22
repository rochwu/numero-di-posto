import {atom} from 'recoil';

export const isAidOnState = atom({
  key: 'isAidOnState',
  default: true,
});

export const canSeeHistoryState = atom({
  key: 'canSeeHistoryState',
  default: false,
});

export const canOverscrollState = atom({
  key: `canOverscrollState`,
  default: window.history.length > 1,
});
