import styled from '@emotion/styled';

import {actions, Record as RecordState, State} from '../state';
import {Colors, Fill, getIndices} from '../globals';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useRef} from 'react';

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

const HighlightContainer = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
});

const Color = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: `0.9em`,
  width: `0.9em`,
  border: '1px solid black',
  borderRadius: `3px`,
});

const createAction = (fill: Fill) => {
  switch (fill) {
    case Fill.Pencil:
      return 'marked';
    case Fill.Auto:
      return `auto'ed`;
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

const colorToValue = (() => {
  const dictionary: {[color: string]: number} = {};
  Colors.Highlight.forEach((color, index) => {
    dictionary[color] = index + 1;
  });

  return (color: string) => dictionary[color];
})();

export const Record = ({record: {selected, fill, key}, index}: Props) => {
  const dispatch = useDispatch();
  const isSelected = useSelector<State, boolean>(
    ({present}) => present === index,
  );

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    } else if (fill === Fill.Color) {
      const style = {backgroundColor: key};

      content = (
        <HighlightContainer>
          colored&nbsp;
          <Color style={style}>{colorToValue(key)}</Color>
          &nbsp;{affects}
        </HighlightContainer>
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
