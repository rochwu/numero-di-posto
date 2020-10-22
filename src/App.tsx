import * as React from 'react';

import styled from '@emotion/styled';
import {useDispatch, useSelector} from 'react-redux';
import {actions, lastSelectedState, State} from './state';

import {Fill, transformId} from './globals';

import {useRecoilState, useResetRecoilState} from 'recoil';

import {Settings} from './Settings';
import {History} from './History';
import {Game} from './Game';

const Container = styled.div({
  display: 'flex',
  fontFamily:
    'Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
  padding: '20px',
});

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

const System = () => {
  const dispatch = useDispatch();

  const selected = useSelector<State, State['selected']>(
    ({selected}) => selected,
  );

  const [lastSelected, setLastSelected] = useRecoilState(lastSelectedState);
  const resetLastSelected = useResetRecoilState(lastSelectedState);

  const onBlur = () => {
    dispatch(actions.clearSelected());
    resetLastSelected();
  };

  React.useEffect(() => {
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  const keyDownHandler = (event: KeyboardEvent) => {
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
        break;
      case 'z': {
        if (metaKey) {
          if (shiftKey) {
            dispatch(actions.redo());
          } else {
            dispatch(actions.undo());
          }
        }
        break;
      }
      case 'ArrowDown':
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'ArrowRight': {
        const idFromArrow = getIdFromArrowKey({
          key,
          id: lastSelected,
        });

        if (idFromArrow) {
          dispatch(actions.setSelected([idFromArrow]));
          setLastSelected(idFromArrow);
        }
        break;
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  });

  return <>{null}</>;
};

export default function App() {
  return (
    <>
      <System />
      <Container>
        <Game />
        <History />
        <Settings />
      </Container>
    </>
  );
}
