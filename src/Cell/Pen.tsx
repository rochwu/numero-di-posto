import * as React from 'react';

import styled from '@emotion/styled';

import {Identifier, selectIsDisabled} from '../state';
import {Colors, Size} from '../globals';
import {useSelector} from 'react-redux';
import {
  isRowValidSelector,
  rowSelector,
  isColumnValidSelector,
  columnSelector,
  isBlockValidSelector,
  blockSelector,
} from '../validation';
import {useRecoilValue, useSetRecoilState} from 'recoil';

type Props = {
  identifier: Identifier;
  value: string; // 1-9 or empty
};

const Container = styled.span(
  ({isDisabled, isValid}: {isValid: boolean; isDisabled: boolean}) => ({
    fontSize: Size.PenFont,
    lineHeight: Size.PenFont,
    fontWeight: isDisabled ? 600 : 'normal',
    color: !isValid ? Colors.Error : isDisabled ? Colors.Disabled : Colors.Fill,
  }),
);

// TODO: Maybe move this to validators
const useIsValid = (id: string) => {
  const isRowValid = useRecoilValue(isRowValidSelector(id));
  const isColumnValid = useRecoilValue(isColumnValidSelector(id));
  const isBlockValid = useRecoilValue(isBlockValidSelector(id));

  return isRowValid && isColumnValid && isBlockValid;
};

const useValueEffect = (id: string, value: string) => {
  const setRow = useSetRecoilState(rowSelector(id));
  const setColumn = useSetRecoilState(columnSelector(id));
  const setBlock = useSetRecoilState(blockSelector(id));

  const setValue = (value: string) => {
    setRow(value);
    setColumn(value);
    setBlock(value);
  };

  // TODO: find a way to prevent this
  React.useEffect(() => {
    setValue(value);

    return () => {
      setValue('');
    };
  }, [value]);
};

export const Pen = ({identifier: id, value}: Props) => {
  const isDisabled = useSelector(selectIsDisabled(id));

  // Figure out whether I like redux more
  // const isValid = useSelector<State, boolean>(state => validate({state, id}));

  const isValid = useIsValid(id);
  useValueEffect(id, value);

  if (!value) {
    return null;
  }

  return (
    <Container isValid={isValid} isDisabled={isDisabled}>
      {value}
    </Container>
  );
};