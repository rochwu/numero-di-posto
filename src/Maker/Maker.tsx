import styled from '@emotion/styled';
import {ITextFieldProps, PrimaryButton, TextField} from '@fluentui/react';
import * as React from 'react';
import {useDispatch} from 'react-redux';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {showMakerState} from '../Settings';
import {actions} from '../state';
import {
  CollapsibleWidth,
  Divider,
  SectionHeading,
  SubsectionHeading,
} from '../ui';

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

// row[1-9] + column[1-9] + value[1-9]
// ie: "112" is value "2" on the topmost leftmost cell
const tuplesToGrid = (...tuples: string[]) => {
  const dictionary: {[key: number]: string} = {};

  tuples.forEach(tuple => {
    const row = (parseInt(tuple[0], 10) - 1) * 9;
    const column = parseInt(tuple[1], 10);
    const index = row + column;

    dictionary[index] = tuple[2];
  });

  let grid = '';

  for (let i = 1; i <= 81; i++) {
    grid += dictionary[i] || '0';
  }

  return grid;
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

export const Maker = () => {
  const isCollapsed = useRecoilValue(showMakerState);

  return (
    <CollapsibleWidth isCollapsed={isCollapsed}>
      <Divider />
      <Container>
        <StringInput />
        <Presets />
      </Container>
    </CollapsibleWidth>
  );
};
