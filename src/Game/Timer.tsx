import React, {useCallback, useEffect, useReducer, useRef} from 'react';

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

const types = {
  add: 'add',
  clear: 'clear',
};

let start = 0; // Used to minimize renders on state diff
const reducer = (state: number, {type}: {type: string}) => {
  switch (type) {
    case types.add: {
      return ~~((Date.now() - start) / 1000);
    }
    case types.clear: {
      return 0;
    }
    default:
      return state;
  }
};

export const Timer = () => {
  const [ellapsed, changeEllapsed] = useReducer(reducer, 0);
  const intervalId = useRef(0);
  const saved = useRef(0);

  const pace = useCallback(() => {
    start = Date.now();
    intervalId.current = setInterval(
      () => changeEllapsed({type: types.add}),
      250,
    );
  }, []);

  // TODO: use this
  const pause = () => {
    saved.current = saved.current + ellapsed;
    changeEllapsed({type: types.clear});
    clearInterval(intervalId.current);
  };

  const reset = useCallback(() => {
    saved.current = 0;
    clearInterval(intervalId.current);
    pace();
  }, [pace]);

  useEffect(() => {
    pace();
    return () => clearInterval(intervalId.current);
  }, [pace]);

  const time = ellapsed + saved.current;
  const seconds = time % 60;
  const rawMinutes = ~~(time / 60); // bitwise NOT is used to truncate
  const minutes = rawMinutes % 60;
  const rawHours = ~~(rawMinutes / 60);
  const hours = rawHours % 60;

  return (
    <Container onClick={reset}>{getTimer({minutes, seconds, hours})}</Container>
  );
};
