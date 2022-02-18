import styled from '@emotion/styled';
import {MouseEventHandler} from 'react';

import {System} from './System';
import {Settings} from './Settings';
import {History} from './History';
import {Game} from './Game';
import {Maker} from './Maker';
import {FontFamily, flags} from './globals';

const Container = styled.div({
  display: 'flex',
  fontFamily: FontFamily.All,
  padding: '20px',
});

const handleMouseUp: MouseEventHandler = () => {
  flags.isSelecting = false;
};

export default function App() {
  return (
    <>
      <System />
      <Container onMouseUp={handleMouseUp}>
        <Game />
        <History />
        <Maker />
        <Settings />
      </Container>
    </>
  );
}
