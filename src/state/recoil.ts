import {atom} from 'recoil';

export const lastSelectedState = atom<string>({
  key: 'lastSelectedState',
  default: '',
});
