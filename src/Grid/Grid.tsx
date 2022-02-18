import {MouseEventHandler} from 'react';

import styled from '@emotion/styled';

import {flags} from '../globals';

import {Box} from './Box';

const Container = styled.div({
  display: 'grid',
  cursor: 'pointer',
  backgroundColor: 'black',
  border: '3px solid black',
  gap: '3px',
});

const handleMouseDown: MouseEventHandler = ({button}) => {
  if (button === 0) {
    flags.isSelecting = true;
  } else if (button === 2) {
    flags.isSelecting = false;
  }
};

export const Grid = () => {
  let boxes = [];

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      boxes.push(<Box row={row} column={column} key={`${row}${column}`} />);
    }
  }

  return <Container onMouseDown={handleMouseDown}>{boxes}</Container>;
};
