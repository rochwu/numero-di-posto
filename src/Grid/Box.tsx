import styled from '@emotion/styled';

import {Cell} from './Cell';
import {Indices} from '../globals';

const Container = styled.div(
  {
    display: 'grid',
    gap: '1px',
  },
  ({row, column}: any) => ({
    gridRow: row + 1,
    gridColumn: column + 1,
  }),
);

export const Box = (props: Indices) => {
  const relativeRow = props.row * 3;
  const relativeColumn = props.column * 3;

  let cells = [];

  for (let row = 0 + relativeRow; row < 3 + relativeRow; row++) {
    for (
      let column = 0 + relativeColumn;
      column < 3 + relativeColumn;
      column++
    ) {
      cells.push(<Cell row={row} column={column} key={`${row}${column}`} />);
    }
  }

  return (
    <Container row={props.row} column={props.column}>
      {cells}
    </Container>
  );
};
