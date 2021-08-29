import styled from '@emotion/styled';
import {useDispatch, useSelector} from 'react-redux';

import {Fill} from '../globals';
import {actions, selectSelected} from '../state';

const highlightColors = ['#fabed4', '#ffd8b1', '#fffac8', '#aaffc3', '#dcbeff'];

const Container = styled.div({
  display: 'flex',
  padding: '3px',
});

// TODO: What is a11y?
const Button = styled.span({
  marginRight: '12px',
  display: 'block',
  width: '2em',
  height: '2em',
  border: '1px black solid',
  borderRadius: '7px',
  cursor: 'pointer',
});

const Color = ({color}: {color: string}) => {
  const dispatch = useDispatch();
  const selected = useSelector(selectSelected);

  const style = {backgroundColor: color};

  const handleClick = () => {
    dispatch(actions.fill({key: color, selected, fill: Fill.Color}));
  };

  return <Button style={style} onClick={handleClick} />;
};

export const Highlighter = () => {
  return (
    <Container>
      {highlightColors.map(color => (
        <Color color={color} key={color} />
      ))}
    </Container>
  );
};
