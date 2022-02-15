import React, {useCallback, useEffect, useReducer, useRef} from 'react';

import styled from '@emotion/styled';
import {useSelector} from 'react-redux';
import {selectIsFilled, selectStarted} from '../state';

const Container = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  fontSize: `1.1em`,
});

const PlayTime = styled.span({
  cursor: 'pointer',
});

const CompletedTime = styled.span({
  marginRight: `1em`,
});

const zeroPad = (n: number) => {
  return n < 10 ? `0${n}` : `${n}`;
};

const getTime = (ms: number) => {
  const seconds = ms % 60;

  const rawMinutes = ~~(ms / 60); // bitwise NOT is used to truncate
  const minutes = rawMinutes % 60;

  const rawHours = ~~(rawMinutes / 60);
  const hours = rawHours % 60;

  return {
    seconds,
    minutes,
    hours,
  };
};

const getTimer = (ms: number) => {
  const {seconds, minutes, hours} = getTime(ms);

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
  const completed = useSelector(selectIsFilled);
  const started = useSelector(selectStarted);

  const [ellapsed, changeEllapsed] = useReducer(reducer, 0);
  const intervalId = useRef(0);
  const saved = useRef(0);
  const completedTime = useRef(0);

  const pace = useCallback(() => {
    start = Date.now();
    // Had to use window since it was getting confused with NodeJs's Timer
    // But we can't use ReturnType since clearInterval expects number
    intervalId.current = window.setInterval(
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

  useEffect(() => {
    if (started) {
      reset();
    }
  }, [started, reset]);

  const time = ellapsed + saved.current;

  useEffect(() => {
    if (completed) {
      completedTime.current = time;
    } else {
      completedTime.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  return (
    <Container>
      {completedTime.current ? (
        <CompletedTime>{getTimer(completedTime.current)}</CompletedTime>
      ) : null}
      <PlayTime onClick={reset}>{getTimer(time)}</PlayTime>
    </Container>
  );
};
