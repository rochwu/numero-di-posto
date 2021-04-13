import * as React from 'react';

import styled from '@emotion/styled';

import {Identifier, Pencil as PencilState, selectPencil} from '../state';
import {Colors, Indices, Size} from '../globals';
import {useSelector} from 'react-redux';
import {useRecoilValue} from 'recoil';
import {tryUniqueCellSelector} from '../validation';

type Props = {
  identifier: Identifier;
};

const Grid = styled.div(
  {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    width: Size.Pencil,
    height: Size.Pencil,
    fontSize: Size.PencilFont,
    lineHeight: Size.PencilFont,
    color: Colors.Pencil,
    fontWeight: 600,
  },
  ({row, column}: Indices) => ({gridRow: row + 1, gridColumn: column + 1}),
);

export const Pencil = ({identifier: id}: Props) => {
  const manualPencil = useSelector(selectPencil(id));
  const uniqueValues = useRecoilValue(tryUniqueCellSelector(id));

  const autoPencil: PencilState = {};
  if (uniqueValues) {
    for (let i = 1; i <= 9; i++) {
      const value = i.toString();

      if (!uniqueValues.has(value)) {
        autoPencil[value] = true;
      }
    }
  }

  const pencil = uniqueValues ? autoPencil : manualPencil;

  const cells = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const number = i * 3 + j + 1; // number on the mark

      const mark = pencil?.[number] ? number : '';

      cells.push(
        <Grid key={number} row={i} column={j}>
          {mark}
        </Grid>,
      );
    }
  }

  return <>{cells}</>;
};
