import * as React from 'react';

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

export const Grid = () => {
  const mouseEvents = (): {
    [key: string]: React.MouseEventHandler;
  } => {
    return {
      onMouseDown: () => {
        flags.isSelecting = true;
      },
      onMouseUp: () => {
        flags.isSelecting = false;
      },
    };
  };

  let boxes = [];

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      boxes.push(<Box row={row} column={column} key={`${row}${column}`} />);
    }
  }

  return <Container {...mouseEvents()}>{boxes}</Container>;
};
