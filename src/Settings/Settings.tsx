import * as React from 'react';
import * as FluentUi from '@fluentui/react';
import {RecoilState, useRecoilState} from 'recoil';

import styled from '@emotion/styled';

import {SectionHeading, Divider} from '../ui';

import {canSeeHistoryState, isAidOnState} from './recoil';

import {useDispatch, useSelector} from 'react-redux';
import {actions, State} from '../state';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

const Toggle = (props: FluentUi.IToggleProps) => {
  return <FluentUi.Toggle {...props} inlineLabel={true} />;
};

const RecoilControl = ({
  state,
  label,
}: {
  state: RecoilState<boolean>;
  label: string;
}) => {
  const [isOn, setIsOn] = useRecoilState(state);

  const handleChange = () => setIsOn(!isOn);

  return <Toggle label={label} checked={isOn} onChange={handleChange} />;
};

// Givens are described as disabled in the store
const GivensControl = () => {
  const dispatch = useDispatch();

  const isDisabled = useSelector<State, boolean>(
    ({disabled}) => !!Object.keys(disabled).length,
  );

  const handleDisable = () => dispatch(actions.toggleDisabled());

  return (
    <Toggle
      label="Absolutely Protect Givens"
      onChange={handleDisable}
      checked={isDisabled}
    />
  );
};

export const Settings = () => {
  return (
    <>
      <Divider />
      <Container>
        <SectionHeading>AI</SectionHeading>
        <RecoilControl state={canSeeHistoryState} label="Affect History" />
        <RecoilControl state={isAidOnState} label="Row + Column ML Assist" />
        <GivensControl />
      </Container>
    </>
  );
};
