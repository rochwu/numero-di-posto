import React, {ReactNode} from 'react';
import * as FluentUi from '@fluentui/react';
import {RecoilState, useRecoilState} from 'recoil';

import styled from '@emotion/styled';

import {SectionHeading, Divider} from '../ui';

import {
  showHistoryState,
  columRowAidState,
  canOverscrollState,
  showMakerState,
  autoPencilState,
  autoSelectPossibleState,
  smartFill,
} from './recoil';

import {useDispatch, useSelector} from 'react-redux';
import {actions, selectHasValues, State} from '../state';
import {FontFamily} from '../globals';

const Container = styled.div({
  overflow: 'visible', // Empty styled divs make it hidden
});

const ToggleContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  whiteSpace: 'nowrap',
  paddingLeft: '2px', // accounts for FluentUi's focus ring
});

const labelStyle: FluentUi.IStyle = {
  fontFamily: FontFamily.All,
};

const Toggle = (props: FluentUi.IToggleProps) => {
  return (
    <FluentUi.Toggle
      {...props}
      inlineLabel={true}
      styles={{
        label: labelStyle,
      }}
    />
  );
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
const GivensControl = ({label}: {label: string}) => {
  const dispatch = useDispatch();

  const isDisabled = useSelector<State, boolean>(({disabled}) => {
    return !!Object.keys(disabled).length;
  });

  const hasValues = useSelector(selectHasValues);

  const handleDisable = () => dispatch(actions.toggleDisabled());

  return (
    <Toggle
      label={label}
      disabled={!hasValues}
      onChange={handleDisable}
      checked={isDisabled}
    />
  );
};

const Group = ({heading, children}: {heading: string; children: ReactNode}) => {
  // TODO: should probs relate the headings and the toggles, tf is your a11y training
  return (
    <>
      <SectionHeading>{heading}</SectionHeading>
      <ToggleContainer>{children}</ToggleContainer>
    </>
  );
};

export const Settings = () => {
  return (
    <>
      <Divider />
      <Container>
        <Group heading="AI">
          <RecoilControl
            state={columRowAidState}
            label="Two Dimensional Assist"
          />
          <RecoilControl
            state={autoPencilState}
            label="Distribute Every Possibility"
          />
          <RecoilControl
            state={autoSelectPossibleState}
            label="Optical Neural Networks"
          />
          <RecoilControl
            state={smartFill}
            label="Prevent Fill Without Aloneness "
          />
        </Group>
        <Group heading="Vex">
          <RecoilControl
            state={showHistoryState}
            label="Disturb History Violently"
          />
          <RecoilControl
            state={showMakerState}
            label="Allow Lower Difficulty Ashamedly"
          />
          <GivensControl label="Absolutely Protect Givens" />
        </Group>
        <Group heading="Bond">
          <RecoilControl
            state={canOverscrollState}
            label="Censor Twin Finger Gestures"
          />
        </Group>
      </Container>
    </>
  );
};
