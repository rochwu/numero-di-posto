import styled from '@emotion/styled';

import {Indices, Size} from '../globals';
import {useRecoilValue} from 'recoil';
import {uniqueColumnSelector, uniqueRowSelector} from '../validation';

const Container = styled.div({display: 'grid'});

const AllowedValue = styled.div(
  {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    width: Size.Pencil,
    height: Size.Pencil,
    fontSize: Size.PencilFont,
    lineHeight: Size.PencilFont,
    color: 'white',
    backgroundColor: '#212121',
    fontWeight: 600,
  },
  ({row, column}: Indices) => ({gridRow: row + 1, gridColumn: column + 1}),
);

const AllowedValues = ({values}: {values: Set<string>}) => {
  const cells = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const number = i * 3 + j + 1;

      cells.push(
        <AllowedValue key={number} row={i} column={j}>
          {values.has(`${number}`) ? '' : number}
        </AllowedValue>,
      );
    }
  }

  return <Container>{cells}</Container>;
};

type Props = {
  identifier: number;
};

export const AllowedColumnValues = ({identifier: id}: Props) => {
  const values = useRecoilValue(uniqueColumnSelector(id));

  return <AllowedValues values={values} />;
};

export const AllowedRowValues = ({identifier: id}: Props) => {
  const values = useRecoilValue(uniqueRowSelector(id));

  return <AllowedValues values={values} />;
};

export const Aid = () => {};
