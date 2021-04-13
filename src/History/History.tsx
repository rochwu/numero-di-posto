import React from 'react';

import styled from '@emotion/styled';
import {useSelector} from 'react-redux';

import {State} from '../state';
import {Record} from './Record';
import {CollapsibleWidth, SectionHeading} from '../ui';

import {Divider} from '../ui';
import {useRecoilValue} from 'recoil';
import {showHistoryState} from '../Settings';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  whiteSpace: 'nowrap',
});

const Scroll = styled.div({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'scroll',
  height: `22em`, // Number of Records to show
  paddingTop: `3px`, // accounts for Setting's toggle extra paddings
});

const Timeline = () => {
  const history = useSelector<State, State['history']>(({history}) => history);

  return (
    <Container>
      <SectionHeading>History + Time Travel</SectionHeading>
      <Scroll>
        {history.map(({record}, index) => {
          return <Record key={index} record={record} index={index} />;
        })}
      </Scroll>
    </Container>
  );
};

export const History = () => {
  const canSeeHistory = useRecoilValue(showHistoryState);

  return (
    <CollapsibleWidth isCollapsed={canSeeHistory}>
      <Divider />
      <Timeline />
    </CollapsibleWidth>
  );
};
