import {atom, selectorFamily} from 'recoil';

export const selectedState = atom<string[]>({
  key: 'selectedState',
  default: [],
});

export const lastSelectedState = atom<string>({
  key: 'lastSelectedState',
  default: '',
});

export const isFirstSelectedSelector = selectorFamily<boolean, string>({
  key: 'isFirstSelectedSelector',
  get: (id: string) => ({get}) => {
    const selected = get(selectedState);

    if (selected.length < 2) {
      // Don't feel we should show if there's only 1
      return false;
    }

    return id === selected[0];
  },
});

export const isSelectedSelector = selectorFamily<boolean, string>({
  key: `isSelectedSelector`,
  get: (id: string) => ({get}) => {
    return !!get(selectedState).find(element => element === id);
  },
  set: (id: string) => ({get, set}, isSelected) => {
    const index = get(selectedState).findIndex(element => element === id);

    if (index < 0) {
      if (isSelected) {
        // unique filter
        set(selectedState, previous => [...previous, id]);
      }
    } else if (!isSelected) {
      // only delete if found
      set(selectedState, previous => [
        ...previous.slice(0, index),
        ...previous.slice(index + 1),
      ]);
    }
  },
});
