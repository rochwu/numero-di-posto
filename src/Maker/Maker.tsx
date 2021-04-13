import styled from '@emotion/styled';
import {ITextFieldProps, PrimaryButton, TextField} from '@fluentui/react';
import * as React from 'react';
import {useDispatch} from 'react-redux';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {showMakerState} from '../Settings';
import {actions} from '../state';
import {CollapsibleWidth, Divider, SectionHeading} from '../ui';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  whiteSpace: 'nowrap',
});

const StringInput = () => {
  const dispatch = useDispatch();

  const show = useSetRecoilState(showMakerState);

  const [disabled, setDisabled] = React.useState(true);
  const value = React.useRef('');

  const handleChange: ITextFieldProps['onChange'] = (_, newValue = '') => {
    const isValid = newValue?.length === 81;

    value.current = newValue;

    setDisabled(!isValid);
  };

  const handleClick = () => {
    dispatch(actions.make(value.current));
    show(false);
  };

  return (
    <>
      <TextField
        onChange={handleChange}
        placeholder="81 characters 0-9"
        multiline
        rows={5}
      />
      <PrimaryButton onClick={handleClick} disabled={disabled}>
        Propose
      </PrimaryButton>
    </>
  );
};

export const Maker = () => {
  const isCollapsed = useRecoilValue(showMakerState);

  return (
    <CollapsibleWidth isCollapsed={isCollapsed}>
      <Divider />
      <Container>
        <SectionHeading>Rebuild</SectionHeading>
        <StringInput />
      </Container>
    </CollapsibleWidth>
  );
};
