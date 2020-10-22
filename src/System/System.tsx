import * as React from 'react';
import {useDispatch} from 'react-redux';
import {useResetRecoilState} from 'recoil';

import {actions, lastSelectedState} from '../state';

import {useKeyDownEffect} from './useKeyDownEffect';

export const System = () => {
  const dispatch = useDispatch();

  useKeyDownEffect();

  const resetLastSelected = useResetRecoilState(lastSelectedState);

  const onBlur = () => {
    dispatch(actions.clearSelected());
    resetLastSelected();
  };

  React.useEffect(() => {
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return <>{null}</>;
};
