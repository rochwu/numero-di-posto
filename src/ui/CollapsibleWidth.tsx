import React, {CSSProperties, ReactNode} from 'react';

import {Transition} from 'react-transition-group';
import {TransitionStatus} from 'react-transition-group/Transition';

const DURATION = 300;

type Props = {
  isCollapsed?: boolean;
  children: ReactNode;
};

const transitionStyles: {[key in TransitionStatus]?: CSSProperties} = {
  entering: {transform: `scaleX(1)`, maxWidth: `100%`},
  entered: {transform: `scaleX(1)`, maxWidth: `100%`},
  exiting: {transform: `scaleX(0)`, maxWidth: 0},
  exited: {transform: `scaleX(0)`, maxWidth: 0},
};

const defaultSyles: CSSProperties = {
  display: 'flex',
  transition: `max-width ${DURATION}ms linear, transform ${DURATION}ms ease-in-out`,
  transformOrigin: 'right',
};

export const CollapsibleWidth = ({isCollapsed, children}: Props) => {
  return (
    <Transition in={isCollapsed} timeout={DURATION} unmountOnExit>
      {state => {
        // Using `style` over a styled component to optimize performance
        return (
          <div style={{...defaultSyles, ...transitionStyles[state]}}>
            {children}
          </div>
        );
      }}
    </Transition>
  );
};
