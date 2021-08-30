import {useCallback, useEffect} from 'react';
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

  const handleBlur = useCallback(() => {
    dispatch(actions.clearSelected());
    resetLastSelected();
  }, [resetLastSelected, dispatch]);

  useEffect(() => {
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleBlur]);

  useEffect(() => {
    if (canOverscroll) {
      document.body.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overscrollBehavior = 'auto';
    }
  }, [canOverscroll]);

  return <>{null}</>;
};
