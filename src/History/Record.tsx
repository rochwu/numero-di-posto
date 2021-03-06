import * as React from 'react';

import styled from '@emotion/styled';

import {actions, Record as RecordState, State} from '../state';
import {Colors, Fill, getIndices} from '../globals';
import {useDispatch, useSelector} from 'react-redux';

const Subject = styled.span({
  color: Colors.Fill,
});

const Container = styled.div({
  cursor: 'pointer',
  ':hover': {
    backgroundColor: Colors.Selected,
  },
  paddingLeft: `0.5em`,
  paddingRight: `0.5em`,
});

const Selected = styled.div({
  fontWeight: 'bold',
  transform: `scale(1.1)`,
});

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

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isSelected) {
      ref.current?.scrollIntoView();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []); // Only 1 record is born with isSelected, the rest gain it by click

  const handleClick = () => {
    dispatch(actions.timeTravel(index));
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
        <span>
          <Subject>removed</Subject> {affects}
        </span>
      );
    } else {
      const action = createAction(fill);

      content = (
        <span>
          {action} <Subject>{key}</Subject> {affects}
        </span>
      );
    }
  }

  return (
    <Container ref={ref} id={getElementId(index)} onClick={handleClick}>
      {isSelected ? <Selected>{content}</Selected> : content}
    </Container>
  );
};
