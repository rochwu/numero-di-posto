import {atom} from 'recoil';

export const isAidOnState = atom({
  key: 'isAidOnState',
  default: true,
});

export const canSeeHistoryState = atom({
  key: 'canSeeHistoryState',
  default: false,
});
