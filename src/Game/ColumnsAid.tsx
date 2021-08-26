import styled from '@emotion/styled';

import {Size} from '../globals';

import {AllowedColumnValues} from './AllowedValues';

const Container = styled.div({
  display: 'grid',
  columnGap: '3px',
  gridAutoFlow: 'column',
  padding: `0 3px 3px 3px`,
});

const Box = styled.div({
  display: 'grid',
  columnGap: '1px',
  gridTemplateColumns: `repeat (3 ${Size.Pen})`,
  gridTemplateRows: Size.Pen,
  gridAutoFlow: 'column',
});

export const ColumnsAid = () => {
  let boxes = [];

  for (let i = 0; i < 9; i = i + 3) {
    let cells = [];

    for (let j = i; j < i + 3; j++) {
      cells.push(<AllowedColumnValues key={j} identifier={j} />);
    }
    boxes.push(<Box key={i}>{cells}</Box>);
  }

  return <Container>{boxes}</Container>;
};
