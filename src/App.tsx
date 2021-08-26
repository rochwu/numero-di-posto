import styled from '@emotion/styled';

import {System} from './System';
import {Settings} from './Settings';
import {History} from './History';
import {Game} from './Game';
import {Maker} from './Maker';
import {FontFamily} from './globals';

const Container = styled.div({
  display: 'flex',
  fontFamily: FontFamily.All,
  padding: '20px',
});

export default function App() {
  return (
    <>
      <System />
      <Container>
        <Game />
        <History />
        <Maker />
        <Settings />
      </Container>
    </>
  );
}
