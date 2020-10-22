import * as React from 'react';

import styled from '@emotion/styled';

import {Identifier, selectPencil} from '../state';
import {Colors, Indices, Size} from '../globals';
import {useSelector} from 'react-redux';

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
  const pencil = useSelector(selectPencil(id));

  const cells = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const number = i * 3 + j + 1; // number on the mark

      cells.push(
        <Grid key={number} row={i} column={j}>
          {pencil?.[number] ? number : ''}
        </Grid>,
      );
    }
  }

  return <>{cells}</>;
};
