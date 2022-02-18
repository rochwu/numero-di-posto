import {MouseEventHandler, useEffect} from 'react';

import styled from '@emotion/styled';

import {
  actions,
  Identifier,
  Pencil as PencilState,
  selectPencil,
} from '../state';
import {Colors, Fill, Indices, Size} from '../globals';
import {useDispatch, useSelector} from 'react-redux';
import {useRecoilValue} from 'recoil';
import {tryUniqueCellSelector} from '../validation';
import {autoSelectPossibleState} from '../Settings';

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

  const dispatch = useDispatch();
  const doAutoFill = useRecoilValue(autoSelectPossibleState);

  const autoPencil: PencilState = {};
  let remainingValue = '';

  if (uniqueValues) {
    for (let i = 1; i <= 9; i++) {
      const value = i.toString();

      if (!uniqueValues.has(value)) {
        autoPencil[value] = true;
        remainingValue = value;
      }
    }
  }

  useEffect(() => {
    if (doAutoFill && uniqueValues?.size === 8) {
      dispatch(
        actions.fill({selected: [id], fill: Fill.Auto, key: remainingValue}),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doAutoFill, uniqueValues]);

  const handleDoubleClick = (value: string): MouseEventHandler => () => {
    if (value) {
      dispatch(actions.showPossibleSelection({id, value}));
    }
  };

  const pencil = uniqueValues ? autoPencil : manualPencil;

  const cells = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const number = i * 3 + j + 1; // number on the mark

      const mark = pencil?.[number] ? `${number}` : '';

      cells.push(
        <Grid
          key={number}
          row={i}
          column={j}
          onDoubleClick={handleDoubleClick(mark)}
        >
          {mark}
        </Grid>,
      );
    }
  }

  return <>{cells}</>;
};
