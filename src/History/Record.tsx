import * as React from 'react';

import styled from '@emotion/styled';

import {actions, Record as RecordState, State} from '../state';
import {Colors, Fill, getIndices} from '../globals';
import {useDispatch, useSelector} from 'react-redux';

const Subject = styled.span({
  color: Colors.Fill,
});

const Container = styled.span(
  {
    fontFamily: `Consolas,monospace`,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: Colors.Selected,
    },
    paddingLeft: `0.5em`,
    paddingRight: `0.5em`,
  },
  ({isSelected}: {isSelected: boolean}) => ({
    border: isSelected ? '1px solid black' : undefined,
  }),
);

const createAction = (fill: Fill) => {
  switch (fill) {
    case Fill.Pencil:
      return 'marked';
    default:
      return 'inked';
  }
};

type Props = {
  record: RecordState;
  index: number;
};

const getElementId = (index: number) => {
  return `record${index}`;
};

export const Record = ({record: {selected, fill, key}, index}: Props) => {
  const dispatch = useDispatch();
  const isSelected = useSelector<State, boolean>(
    ({present}) => present === index,
  );

  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (isSelected) {
      ref.current?.scrollIntoView();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []); // Only 1 record is born with isSelected, the rest gain it by click

  const onClick = () => {
    dispatch(actions.historyJump(index));
    ref.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
  };

  const {length} = selected;

  let content = <></>; // Can't define JSX, so make TS derive it

  if (length === 0) {
    content = <Subject>bang!</Subject>;
  } else {
    const {row, column} = getIndices(selected[0]);

    // Human readable row and column
    const affects =
      length === 1 ? `(${row + 1}, ${column + 1})` : `${length} cells`;

    if (fill === Fill.Delete) {
      content = (
        <>
          <Subject>removed</Subject> {affects}
        </>
      );
    } else {
      const action = createAction(fill);

      content = (
        <>
          {action} <Subject>{key}</Subject> {affects}
        </>
      );
    }
  }

  return (
    <Container
      ref={ref}
      id={getElementId(index)}
      onClick={onClick}
      isSelected={isSelected}
    >
      {content}
    </Container>
  );
};
