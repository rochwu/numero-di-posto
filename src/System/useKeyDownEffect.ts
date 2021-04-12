import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRecoilState} from 'recoil';

import {Fill, transformId} from '../globals';
import {actions, lastSelectedState, State} from '../state';

const getIdFromArrowKey = ({key, id}: {key: string; id: string}) => {
  let row = 0;
  let column = 0;

  switch (key) {
    case 'ArrowDown':
      row += 1;
      break;
    case 'ArrowUp':
      row -= 1;
      break;
    case 'ArrowLeft':
      column -= 1;
      break;
    case 'ArrowRight':
      column += 1;
      break;
  }

  return transformId(id, {row, column});
};

export const useKeyDownEffect = () => {
  const dispatch = useDispatch();

  const selected = useSelector<State, State['selected']>(
    ({selected}) => selected,
  );

  const [lastSelected, setLastSelected] = useRecoilState(lastSelectedState);

  const handleKeyDown = (event: KeyboardEvent) => {
    const {key, metaKey, shiftKey} = event;

    const fill = metaKey ? Fill.Pencil : Fill.Normal;

    if (key.match(/[1-9]/)) {
      if (metaKey) {
        event.preventDefault(); // Prevents browser tab switch
      }
      dispatch(actions.fill({key, fill, selected}));
    }

    switch (key) {
      case '`':
      case 'Backspace':
        dispatch(actions.fill({key: '', fill: Fill.Delete, selected}));
        return;
      case 'z': {
        if (metaKey) {
          if (shiftKey) {
            dispatch(actions.redo());
          } else {
            dispatch(actions.undo());
          }
        }
        return;
      }
      case 'a': {
        if (metaKey) {
          event.preventDefault(); // Highlight other text
          dispatch(actions.selectAll());
        }
        return;
      }
      case 'ArrowDown':
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'ArrowRight': {
        event.preventDefault(); // Scroll

        const idFromArrow = getIdFromArrowKey({
          key,
          id: lastSelected,
        });

        if (idFromArrow) {
          dispatch(actions.setSelected([idFromArrow]));
          setLastSelected(idFromArrow);
        }
        return;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
};
