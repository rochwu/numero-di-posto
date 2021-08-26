import {useRef, useState} from 'react';

import styled from '@emotion/styled';
import {ITextFieldProps, PrimaryButton, TextField} from '@fluentui/react';
import {useDispatch, useSelector} from 'react-redux';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {showMakerState} from '../Settings';
import {actions, State} from '../state';
import {
  CollapsibleWidth,
  Divider,
  SectionHeading,
  SubsectionHeading,
} from '../ui';
import {tuplesToGrid, transform} from '../generator';
import {getId} from '../globals';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  whiteSpace: 'nowrap',
});

const StringInput = () => {
  const dispatch = useDispatch();

  const show = useSetRecoilState(showMakerState);

  const [disabled, setDisabled] = useState(true);
  const value = useRef('');

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
      <SectionHeading>Remake</SectionHeading>
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

const PresetButton = ({name, tuples}: {name: string; tuples: string[]}) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(actions.make(tuplesToGrid(...tuples)));
  };

  return (
    <PrimaryButton onClick={handleClick} style={{margin: '1px 0'}}>
      {name}
    </PrimaryButton>
  );
};

const Presets = () => {
  return (
    <>
      <SubsectionHeading>Plagiarize</SubsectionHeading>
      <PresetButton name="OG Miracle" tuples={['531', '672']} />
      <PresetButton name="WTF Miracle" tuples={['551', '982']} />
    </>
  );
};

const Transform = () => {
  const dispatch = useDispatch();

  const state = useSelector((state: State) => state);

  const handleClick = () => {
    const {disabled, values} = state;

    let grid = '';

    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        const id = getId(x, y);

        if (disabled[id]) {
          grid += values[id];
        } else {
          grid += '0';
        }
      }
    }

    dispatch(actions.make(transform(grid)));
  };

  return (
    <>
      <SubsectionHeading>Facade</SubsectionHeading>
      <PrimaryButton onClick={handleClick} style={{margin: '1px 0'}}>
        Wonk
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
        <StringInput />
        <Presets />
        <Transform />
      </Container>
    </CollapsibleWidth>
  );
};
