import * as React from 'react';

import styled from '@emotion/styled';
import {useDispatch, useSelector} from 'react-redux';
import {
  actions,
  lastSelectedState,
  selectIsFirstSelected,
  selectIsSelected,
  selectValue,
} from '../state';
import {flags, getId, Colors, Indices, Size} from '../globals';
import {useSetRecoilState} from 'recoil';
import {Pencil} from './Pencil';
import {Pen} from './Pen';

const Container = styled.div(
  {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    height: Size.Pen,
    width: Size.Pen,
  },
  ({row, column, isSelected, isFirstSelected}: any) => ({
    gridRow: (row % 3) + 1,
    gridColumn: (column % 3) + 1,
    backgroundColor: isSelected ? Colors.Selected : 'white',
    boxShadow: isFirstSelected ? `inset 0 0 4px black` : undefined,
  }),
);

export const Cell = ({row, column}: Indices) => {
  const id = getId(row, column);

  const dispatch = useDispatch();

  const value = useSelector(selectValue(id));

  const setLastSelected = useSetRecoilState(lastSelectedState);

  const isSelected = useSelector(selectIsSelected(id));
  const isFirstSelected = useSelector(selectIsFirstSelected(id));

  const onMouseEnter = () => {
    if (flags.isSelecting) {
      dispatch(actions.select({id, isSelected: true}));
    }
  };

  const onMouseDown: React.MouseEventHandler = ({metaKey, shiftKey}) => {
    setLastSelected(id);

    if (!metaKey) {
      dispatch(actions.clearSelected());
    }

    if (metaKey && isSelected) {
      dispatch(actions.select({id, isSelected: false}));
      return;
    }

    dispatch(actions.select({id, isSelected: true}));
  };

  return (
    <Container
      row={row}
      column={column}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      isFirstSelected={isFirstSelected}
      isSelected={isSelected}
    >
      {value ? (
        <Pen identifier={id} value={value} />
      ) : (
        <Pencil identifier={id} />
      )}
    </Container>
  );
};
