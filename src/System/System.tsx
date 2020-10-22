import React, {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {canOverscrollState} from '../Settings/recoil';

import {actions, lastSelectedState} from '../state';

import {useKeyDownEffect} from './useKeyDownEffect';

export const System = () => {
  const dispatch = useDispatch();

  useKeyDownEffect();

  const resetLastSelected = useResetRecoilState(lastSelectedState);
  const canOverscroll = useRecoilValue(canOverscrollState);

  const onBlur = useCallback(() => {
    dispatch(actions.clearSelected());
    resetLastSelected();
  }, [resetLastSelected, dispatch]);

  useEffect(() => {
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('blur', onBlur);
    };
  }, [onBlur]);

  useEffect(() => {
    if (canOverscroll) {
      document.body.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overscrollBehavior = 'auto';
    }
  }, [canOverscroll]);

  return <>{null}</>;
};
