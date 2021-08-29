import styled from '@emotion/styled';
import {useDispatch, useSelector} from 'react-redux';

import {Fill, Colors} from '../globals';
import {actions, selectSelected} from '../state';

const Container = styled.div({
  display: 'flex',
  padding: '3px',
});

// TODO: What is a11y?
const Button = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '12px',
  width: '2em',
  height: '2em',
  border: '1px black solid',
  borderRadius: '7px',
  cursor: 'pointer',
});

const Color = ({color, value}: {color: string; value: number}) => {
  const dispatch = useDispatch();
  const selected = useSelector(selectSelected);

  const style = {backgroundColor: color};

  const handleClick = () => {
    dispatch(actions.fill({key: color, selected, fill: Fill.Color}));
  };

  return (
    <Button style={style} onClick={handleClick}>
      {value}
    </Button>
  );
};

export const Highlighter = () => {
  return (
    <Container>
      {Colors.Highlight.map((color, index) => (
        <Color color={color} value={index + 1} key={color} />
      ))}
    </Container>
  );
};
