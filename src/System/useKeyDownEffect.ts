import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRecoilState, useRecoilValue} from 'recoil';

import {Fill, transformId, Colors} from '../globals';
import {actions, lastSelectedState, selectSelected} from '../state';
import {smartFill} from '../Settings';

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

  const selected = useSelector(selectSelected);

  const [lastSelected, setLastSelected] = useRecoilState(lastSelectedState);
  const shouldSmartFill = useRecoilValue(smartFill);

  const handleKeyDown = (event: KeyboardEvent) => {
    const {key, metaKey, shiftKey, altKey, code} = event;

    const fill = metaKey ? Fill.Pencil : Fill.Normal;

    // Using code to account for altKey. Hope no one is a psycho and maps their numbers elsewhere
    if (code.match(/Digit[1-9]/)) {
      const digit = code[5];

      if (metaKey) {
        event.preventDefault(); // Prevents browser tab switch
      }

      if (altKey) {
        dispatch(
          actions.fill({
            key: Colors.Highlight[parseInt(digit, 10) - 1],
            fill: Fill.Color,
            selected,
          }),
        );
      } else if (shiftKey || (shouldSmartFill && fill === Fill.Normal)) {
        dispatch(actions.smartFill(digit));
      } else {
        dispatch(actions.fill({key: digit, fill, selected}));
      }
    }

    switch (key) {
      case '`':
      case 'Backspace':
        dispatch(actions.fill({key: '', fill: Fill.Delete, selected}));
        return;
      case 'Enter':
      case 'Spacebar':
      case ' ': {
        if (selected.length === 1) {
          dispatch(actions.showPossibleSelection());
        }

        return;
      }
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
