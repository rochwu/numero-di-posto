import React, {useEffect, useReducer} from 'react';

import styled from '@emotion/styled';

const Container = styled.span({
  display: 'flex',
  justifyContent: 'flex-end',
  cursor: 'pointer',
  fontSize: `1.1em`,
});

const zeroPad = (n: number) => {
  return n < 10 ? `0${n}` : `${n}`;
};

const getTimer = ({
  seconds,
  minutes,
  hours,
}: {
  seconds: number;
  minutes: number;
  hours: number;
}) => {
  if (hours) {
    return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
  } else if (minutes) {
    return `${minutes}:${zeroPad(seconds)}`;
  } else {
    return `${seconds}`;
  }
};

let start = 0; // Didn't want this to modify render

const types = {
  add: 'add',
  clear: 'clear',
};

// Used to minimize renders on state diff
const reducer = (state: number, {type}: {type: string}) => {
  switch (type) {
    case types.add: {
      return ~~((Date.now() - start) / 1000);
    }
    case types.clear: {
      start = Date.now();
      return 0;
    }
    default:
      return state;
  }
};

export const Timer = () => {
  const [time, dispatchTime] = useReducer(reducer, 0);

  const onClick = () => {
    dispatchTime({type: types.clear});
  };

  useEffect(() => {
    start = Date.now();
    setInterval(() => dispatchTime({type: types.add}), 250);
  }, []);

  const seconds = time % 60;
  const rawMinutes = ~~(time / 60); // bitwise NOT is used to truncate
  const minutes = rawMinutes % 60;
  const rawHours = ~~(rawMinutes / 60);
  const hours = rawHours % 60;

  return (
    <Container onClick={onClick}>
      {getTimer({minutes, seconds, hours})}
    </Container>
  );
};
