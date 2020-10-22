import * as React from 'react';
import {useRecoilValue} from 'recoil';
import styled from '@emotion/styled';

import {Grid} from '../Grid';
import {isAidOnState} from '../Settings/recoil';

import {RowsAid} from './RowsAid';
import {ColumnsAid} from './ColumnsAid';
import {Timer} from './Timer';

const Container = styled.div({
  display: 'grid',
  userSelect: 'none',
  height: `100%`,
});

const ColumnsContainer = styled.div({
  display: 'grid',
  gridRow: 1,
  gridColumn: 2,
});

const RowsContainer = styled.div({
  display: 'grid',
  gridRow: 2,
  gridColumn: 1,
});

const GridContainer = styled.div({
  display: 'grid',
  gridRow: 2,
  gridColumn: 2,
});

const TimerContainer = styled.div({
  display: 'grid',
  gridRow: 3,
  gridColumn: 2,
});

const Aid = () => {
  const isAidOn = useRecoilValue(isAidOnState);

  if (isAidOn) {
    return (
      <>
        <ColumnsContainer>
          <ColumnsAid />
        </ColumnsContainer>
        <RowsContainer>
          <RowsAid />
        </RowsContainer>
      </>
    );
  } else {
    return <>{null}</>;
  }
};

export const Game = () => {
  return (
    <Container>
      <GridContainer>
        <Grid />
      </GridContainer>
      <TimerContainer>
        <Timer />
      </TimerContainer>
      <Aid />
    </Container>
  );
};